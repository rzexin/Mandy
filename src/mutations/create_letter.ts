import { CLOCK_OBJECT_ID } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "../constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";
import { bcs } from "@mysten/sui/bcs";
import { sealEncryptMsg } from "@/lib/sealClient";

interface LetterInfo {
    title: string;
    content: string;
    recipients: string[];
    deliveryTimeMs: number;
    fileName: string;
    attachBlobId: string;
    isPublic: boolean;
}

export function useCreateLetter() {
    const account = useCurrentAccount();
    const executeTransaction = useTransactionExecution();

    return useMutation({
        mutationFn: async (info: LetterInfo) => {
            if (!account?.address) {
                throw new Error("You need to connect your wallet first pls!");
            }

            const { base64EncryptedData: encryptedContent } =
                await sealEncryptMsg(info.content);

            const tx = new Transaction();

            tx.moveCall({
                target: CONSTANTS.MANDY_CONTRACT.TARGET_CREATE_LETTER,
                arguments: [
                    tx.object(CONSTANTS.MANDY_CONTRACT.MANDY_SHARED_OBJECT_ID),
                    tx.pure.string(info.title),
                    tx.pure.string(encryptedContent),
                    tx.pure(bcs.vector(bcs.Address).serialize(info.recipients)),
                    tx.pure.u64(info.deliveryTimeMs),
                    tx.pure.string(info.fileName),
                    tx.pure.string(info.attachBlobId),
                    tx.pure.bool(info.isPublic),
                    tx.object(CLOCK_OBJECT_ID),
                ],
            });

            return executeTransaction(tx);
        },
        onError: (error) => {
            console.error("Failed to create Letter:", error);
            throw error;
        },
        onSuccess: (data) => {
            console.log("Successfully created Letter:", data);
        },
    });
}
