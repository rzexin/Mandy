import mandyContract from "../../mandy-contract.json";

export enum QueryKey {
    GetLetterQueryKey = "GetLetterQueryKey",
    GetMultipleLettersQueryKey = "GetMultipleLettersQueryKey",
}

export const CLOCK_OBJECT_ID = "0x6";
export const SUI_COIN_TYPE = "0x2::sui::SUI";

export const CONSTANTS = {
    MANDY_CONTRACT: {
        TARGET_CREATE_LETTER: `${mandyContract.packageId}::mandy::create_letter`,
        PACKAGE_ID: mandyContract.packageId,
        MANDY_SHARED_OBJECT_ID: mandyContract.postOfficeSharedObjectId,
    },
    WALRUS: {
        PUBLISHER_URL: "https://publisher.walrus-testnet.walrus.space",
        AGGREGATOR_URL: "https://aggregator.walrus-testnet.walrus.space",
    },
};
