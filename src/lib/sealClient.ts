import { CONSTANTS } from "@/constants";
import { suiClient } from "@/providers/NetworkConfig";
import { getAllowlistedKeyServers, SealClient } from "@mysten/seal";
import { toHex, fromHex } from "@mysten/sui/utils";

export const sealClient = new SealClient({
    suiClient,
    serverObjectIds: getAllowlistedKeyServers("testnet"),
    verifyKeyServers: false,
});

export async function sealEncryptData(
    client: SealClient,
    policyObject: string,
    data: Uint8Array,
    packageId: string,
    threshold = 2
): Promise<{ encryptedData: Uint8Array; id: string }> {
    // 创建随机nonce
    const nonce = crypto.getRandomValues(new Uint8Array(5));

    // 构建ID
    const policyObjectBytes = fromHex(policyObject);
    const id = toHex(new Uint8Array([...policyObjectBytes, ...nonce]));

    // 加密数据
    const { encryptedObject } = await client.encrypt({
        threshold,
        packageId,
        id,
        data,
    });

    return {
        encryptedData: encryptedObject,
        id,
    };
}

export async function sealEncryptMsg(msg: string) {
    const { encryptedData, id } = await sealEncryptData(
        sealClient,
        CONSTANTS.MANDY_CONTRACT.MANDY_SHARED_OBJECT_ID,
        new TextEncoder().encode(msg),
        CONSTANTS.MANDY_CONTRACT.PACKAGE_ID
    );

    const base64EncryptedData = Buffer.from(encryptedData).toString("base64");

    return { base64EncryptedData, id };
}

export async function sealEncryptBytes(data: Uint8Array): Promise<Uint8Array> {
    const { encryptedData } = await sealEncryptData(
        sealClient,
        CONSTANTS.MANDY_CONTRACT.MANDY_SHARED_OBJECT_ID,
        data,
        CONSTANTS.MANDY_CONTRACT.PACKAGE_ID
    );

    return encryptedData;
}
