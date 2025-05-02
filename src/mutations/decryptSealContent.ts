import { CONSTANTS } from "@/constants";
import { sealClient } from "@/lib/sealClient";
import { suiClient } from "@/providers/NetworkConfig";
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { EncryptedObject, NoAccessError, SessionKey } from "@mysten/seal";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface DecryptContentParams {
    letterId: number;
    base64Content: string;
}

export function useDecryptSealContent() {
    const signer = useCurrentAccount();
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

    return useMutation({
        mutationFn: async ({
            letterId,
            base64Content,
        }: DecryptContentParams) => {
            if (!signer) {
                throw new Error("请先连接钱包");
            }

            const sessionKey = new SessionKey({
                address: signer.address,
                packageId: CONSTANTS.MANDY_CONTRACT.PACKAGE_ID,
                ttlMin: 10,
            });

            const message = sessionKey.getPersonalMessage();
            const sign = await signPersonalMessage({
                message,
            });

            await sessionKey.setPersonalMessageSignature(sign.signature);

            const contentBytes = new Uint8Array(
                Buffer.from(base64Content, "base64")
            );

            const sealId = EncryptedObject.parse(contentBytes).id;

            const tx = new Transaction();
            tx.moveCall({
                target: `${CONSTANTS.MANDY_CONTRACT.PACKAGE_ID}::mandy::seal_approve`,
                arguments: [
                    tx.pure.vector("u8", fromHex(sealId)),
                    tx.object(CONSTANTS.MANDY_CONTRACT.MANDY_SHARED_OBJECT_ID),
                    tx.pure.u64(letterId),
                    tx.object("0x6"),
                ],
            });

            const txBytes = await tx.build({
                client: suiClient,
                onlyTransactionKind: true,
            });

            try {
                await sealClient.fetchKeys({
                    ids: [sealId],
                    txBytes,
                    sessionKey,
                    threshold: 2,
                });

                const decryptedContent = await sealClient.decrypt({
                    data: contentBytes,
                    sessionKey,
                    txBytes,
                });

                return new TextDecoder().decode(decryptedContent);
            } catch (err) {
                const errorMsg =
                    err instanceof NoAccessError
                        ? "没有访问权限"
                        : "解密失败，请重试";
                throw new Error(errorMsg);
            }
        },
        onError: (error: Error) => {
            console.error("解密失败:", error);
            toast.error(error.message);
        },
        onSuccess: (decryptedContent: string) => {
            console.log("解密成功:", decryptedContent);
        },
    });
}
