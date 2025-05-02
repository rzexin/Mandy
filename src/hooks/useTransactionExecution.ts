import { useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import type { Transaction } from "@mysten/sui/transactions";
import { toast } from "sonner";

export function useTransactionExecution() {
    const client = useSuiClient();
    const { mutateAsync: signTransactionBlock } = useSignTransaction();

    const executeTransaction = async (
        txb: Transaction
    ): Promise<SuiTransactionBlockResponse | void> => {
        try {
            const signature = await signTransactionBlock({
                transaction: txb,
            });

            const res = await client.executeTransactionBlock({
                transactionBlock: signature.bytes,
                signature: signature.signature,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                    showEvents: true,
                },
            });

            toast.success("Successfully executed transaction!");
            return res;
        } catch (e: unknown) {
            const errorMessage =
                e instanceof Error ? e.message : "Unknown error occurred";
            toast.error(`Failed to execute transaction: ${errorMessage}`);
        }
    };

    return executeTransaction;
}
