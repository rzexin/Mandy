import { QueryKey } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { LetterFields } from "@/types/move";

export function useGetMultipleLetters({
    parentId,
    letterIds,
}: {
    parentId: string;
    letterIds: string[];
}) {
    const client = useSuiClient();

    return useQuery({
        queryKey: [QueryKey.GetMultipleLettersQueryKey, parentId, letterIds],
        queryFn: async () => {
            // 这里可以通过一次查询批量获取多个目标的数据
            const promises = letterIds.map((letterId) => {
                // 假设你有一个获取单个目标的函数
                return fetchOneLetter({
                    client,
                    parentId,
                    letterId,
                });
            });
            return Promise.all(promises);
        },
        enabled: !!parentId && !!letterIds && letterIds.length > 0,
        select: (data) => {
            return data.map((letter) => {
                if (letter.data?.content && "fields" in letter.data.content) {
                    if (
                        letter.data.content.fields &&
                        "value" in letter.data.content.fields
                    ) {
                        return (
                            letter.data.content.fields.value as LetterFields
                        ).fields;
                    }
                }
                return null;
            });
        },
    });
}

async function fetchOneLetter({
    client,
    parentId,
    letterId,
}: {
    client: SuiClient;
    parentId: string;
    letterId: string;
}) {
    return await client.getDynamicFieldObject({
        parentId,
        name: {
            type: "u64",
            value: letterId,
        },
    });
}
