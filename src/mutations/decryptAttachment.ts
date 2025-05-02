import { CONSTANTS } from "@/constants";
import { readBlob } from "@/lib/walrusClient";
import { sealClient } from "@/lib/sealClient";
import { suiClient } from "@/providers/NetworkConfig";
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { EncryptedObject, NoAccessError, SessionKey } from "@mysten/seal";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface DecryptAttachmentParams {
    letterId: number;
    blobId: string;
    fileName?: string;
}

// 根据文件头部字节判断文件类型
function detectFileType(data: Uint8Array): string {
    // 常见文件格式的魔数（Magic Numbers）
    const signatures: { [key: string]: Uint8Array[] } = {
        pdf: [new Uint8Array([0x25, 0x50, 0x44, 0x46])],
        png: [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
        jpg: [new Uint8Array([0xff, 0xd8, 0xff])],
        gif: [new Uint8Array([0x47, 0x49, 0x46, 0x38])],
        zip: [new Uint8Array([0x50, 0x4b, 0x03, 0x04])],
        doc: [new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])],
        docx: [
            new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]),
        ],
        mp3: [new Uint8Array([0x49, 0x44, 0x33])],
        mp4: [
            new Uint8Array([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]),
            new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]),
        ],
    };

    // 检查是否为文本文件
    function isTextFile(data: Uint8Array): boolean {
        // 检查前1024个字节是否全部是可打印ASCII字符或常见控制字符
        const sampleSize = Math.min(1024, data.length);
        for (let i = 0; i < sampleSize; i++) {
            const byte = data[i];
            // 不是常见文本字符（可打印ASCII, 制表符, 换行符, 回车符）
            if (
                byte > 127 ||
                (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)
            ) {
                return false;
            }
        }
        return true;
    }

    // 优先检查二进制文件签名
    for (const [extension, signatureList] of Object.entries(signatures)) {
        for (const signature of signatureList) {
            if (data.length >= signature.length) {
                let match = true;
                for (let i = 0; i < signature.length; i++) {
                    if (data[i] !== signature[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    return extension;
                }
            }
        }
    }

    // 如果没有匹配到二进制签名，检查是否为文本文件
    if (isTextFile(data)) {
        // 检查是否是JSON
        try {
            const textDecoder = new TextDecoder("utf-8");
            const text = textDecoder.decode(
                data.slice(0, Math.min(1024, data.length))
            );
            JSON.parse(text.trim());
            return "json";
        } catch (error) {
            console.error("解密附件失败:", error);
            // 尝试检测HTML
            const textDecoder = new TextDecoder("utf-8");
            const text = textDecoder
                .decode(data.slice(0, Math.min(1024, data.length)))
                .toLowerCase();
            if (
                text.includes("<!doctype html>") ||
                text.includes("<html") ||
                text.includes("<body")
            ) {
                return "html";
            }

            // 尝试检测JavaScript
            if (
                text.includes("function") ||
                text.includes("const ") ||
                text.includes("var ") ||
                text.includes("let ")
            ) {
                return "js";
            }

            // 尝试检测CSS
            if (
                text.includes("{") &&
                text.includes("}") &&
                (text.includes(".") || text.includes("#")) &&
                text.includes(":")
            ) {
                return "css";
            }

            return "txt";
        }
    }

    // 默认返回二进制格式
    return "bin";
}

export function useDecryptAttachment() {
    const signer = useCurrentAccount();
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

    return useMutation({
        mutationFn: async ({
            letterId,
            blobId,
            fileName = "attachment",
        }: DecryptAttachmentParams) => {
            if (!signer) {
                throw new Error("请先连接钱包");
            }

            if (!blobId) {
                throw new Error("未找到附件");
            }

            try {
                // 1. 获取加密附件
                const encryptedAttachmentBuffer = await readBlob(blobId);
                const encryptedData = new Uint8Array(encryptedAttachmentBuffer);

                // 2. 创建会话密钥
                const sessionKey = new SessionKey({
                    address: signer.address,
                    packageId: CONSTANTS.MANDY_CONTRACT.PACKAGE_ID,
                    ttlMin: 10,
                });

                // 3. 签名
                const message = sessionKey.getPersonalMessage();
                const sign = await signPersonalMessage({
                    message,
                });

                await sessionKey.setPersonalMessageSignature(sign.signature);

                // 4. 解析 sealId
                const sealId = EncryptedObject.parse(encryptedData).id;

                // 5. 创建交易
                const tx = new Transaction();
                tx.moveCall({
                    target: `${CONSTANTS.MANDY_CONTRACT.PACKAGE_ID}::mandy::seal_approve`,
                    arguments: [
                        tx.pure.vector("u8", fromHex(sealId)),
                        tx.object(
                            CONSTANTS.MANDY_CONTRACT.MANDY_SHARED_OBJECT_ID
                        ),
                        tx.pure.u64(letterId),
                        tx.object("0x6"),
                    ],
                });

                const txBytes = await tx.build({
                    client: suiClient,
                    onlyTransactionKind: true,
                });

                // 6. 获取解密密钥
                await sealClient.fetchKeys({
                    ids: [sealId],
                    txBytes,
                    sessionKey,
                    threshold: 2,
                });

                // 7. 解密数据
                const decryptedData = await sealClient.decrypt({
                    data: encryptedData,
                    sessionKey,
                    txBytes,
                });

                // 8. 检测文件类型并添加适当的扩展名
                const fileType = detectFileType(decryptedData);
                const fileNameWithExtension = fileName.includes(".")
                    ? fileName // 如果已经有扩展名则保留
                    : `${fileName}.${fileType}`; // 否则添加检测到的扩展名

                // 9. 创建并下载文件
                const blob = new Blob([decryptedData]);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileNameWithExtension;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                return true;
            } catch (err) {
                const errorMsg =
                    err instanceof NoAccessError
                        ? "没有访问权限"
                        : "解密附件失败，请重试";
                throw new Error(errorMsg);
            }
        },
        onError: (error: Error) => {
            console.error("解密附件失败:", error);
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("附件下载成功");
        },
    });
}
