import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { useGetLettersParentId } from "./useGetLettersParentId";

export function useGetOneLetter({ letterId }: { letterId: string }) {
    const lettersParentId = useGetLettersParentId();
    // console.log(">>>", lettersParentId);

    return useGetDynamicFieldObject({
        parentId: lettersParentId as string,
        fieldType: "u64",
        fieldValue: letterId,
    });
}
