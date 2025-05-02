import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import type { SuiParsedData } from "@mysten/sui/client";
import type { PostOfficeFields } from "@/types/move";
import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { useGetMultipleLetters } from "./useGetMultipleLetters";

export function useGetLettersIReceived() {
    const account = useCurrentAccount();

    const objectsData = useGetObject({
        objectId: CONSTANTS.MANDY_CONTRACT.MANDY_SHARED_OBJECT_ID,
    });

    // 提前解析数据，以便获取userLetterParentId
    const parsedPostOffice = objectsData?.data?.content as
        | SuiParsedData
        | undefined;
    const postOffice =
        parsedPostOffice && "fields" in parsedPostOffice
            ? (parsedPostOffice.fields as PostOfficeFields)
            : undefined;

    // console.log(">>>>>>>>>>>> ", JSON.stringify(postOffice, null, 2));

    const userLettersParentId =
        postOffice?.user_received_letters?.fields?.id?.id;
    const lettersParentId = postOffice?.letters?.fields?.id?.id;

    // console.log(">>>>>>>>>>>> ", userLettersParentId, lettersParentId);

    const { data: userLetterIds } = useGetDynamicFieldObject({
        parentId: userLettersParentId || "",
        fieldType: "address",
        fieldValue: account?.address || "",
    });

    // console.log(">>>>>>>>>>>> ", userLetterIds);

    const { data: letters } = useGetMultipleLetters({
        parentId: lettersParentId || "",
        letterIds: userLetterIds as string[],
    });

    // console.log(">>>>>>>>>>>> ", JSON.stringify(letters, null, 2));

    return {
        data: letters || [],
        isLoading: false,
        error: null,
    };
}
