import { useSuiClientQuery } from "@mysten/dapp-kit";

interface DynamicFieldObject {
    parentId: string;
    fieldType: string;
    fieldValue: string;
}

export function useGetDynamicFieldObject({
    parentId,
    fieldType,
    fieldValue,
}: DynamicFieldObject) {
    return useSuiClientQuery(
        "getDynamicFieldObject",
        {
            parentId: parentId,
            name: {
                type: fieldType,
                value: fieldValue,
            },
        },
        {
            enabled: !!parentId && !!fieldType && !!fieldValue,
            select: (data) => {
                if (data.data?.content && "fields" in data.data.content) {
                    if (
                        data.data.content.fields &&
                        "value" in data.data.content.fields
                    ) {
                        return data.data.content.fields.value;
                    }
                }
                return null;
            },
        }
    );
}
