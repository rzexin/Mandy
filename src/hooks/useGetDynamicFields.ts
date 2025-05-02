import { useSuiClientQuery } from "@mysten/dapp-kit";

interface DynamicField {
    parentId: string;
}

export function useGetDynamicFields({ parentId }: DynamicField) {
    return useSuiClientQuery(
        "getDynamicFields",
        {
            parentId: parentId,
        },
        {
            enabled: !!parentId,
        }
    );
}
