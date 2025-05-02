import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import type { SuiParsedData } from "@mysten/sui/client";
import type { PostOfficeFields } from "@/types/move";

export function useGetLettersParentId() {
    const objectsData = useGetObject({
        objectId: CONSTANTS.MANDY_CONTRACT.MANDY_SHARED_OBJECT_ID,
    });

    const parsedLetters = objectsData?.data?.content as
        | SuiParsedData
        | undefined;
    const postOffice =
        parsedLetters && "fields" in parsedLetters
            ? (parsedLetters.fields as PostOfficeFields)
            : undefined;

    const lettersParentId = postOffice?.letters?.fields?.id?.id;

    return lettersParentId;
}
