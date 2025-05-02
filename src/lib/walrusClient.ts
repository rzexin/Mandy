import { CONSTANTS } from "@/constants";

export const NUM_EPOCH = 10;

export const storeBlob = async (blobData: Uint8Array) => {
    const url = `${CONSTANTS.WALRUS.PUBLISHER_URL}/v1/blobs?epochs=${NUM_EPOCH}`;
    console.log(`storeBlob url: ${url}`);
    return fetch(url, {
        method: "PUT",
        body: blobData,
    }).then((response) => {
        if (response.status === 200) {
            return response.json();
        }

        throw new Error(
            `Something went wrong when storing the blob!, ${JSON.stringify(
                response,
                null,
                2
            )}`
        );
    });
};

// {
//     "newlyCreated": {
//         "blobObject": {
//             "id": "0x25f4151fa12aaaa7cbc224968179bc1a50fe4cdc20a78b4a67d6a36f69136f4b",
//             "registeredEpoch": 23,
//             "blobId": "kFIie7iOP2dK-QUVZXmGmQMPhyvbZFkRdHbyLfuQ4Mc",
//             "size": 4082,
//             "encodingType": "RS2",
//             "certifiedEpoch": null,
//             "storage": {
//                 "id": "0x0d8573bd30e5ba1ae9589b6ed6c795171d90eb19127faf2d428ecff734e193df",
//                 "startEpoch": 23,
//                 "endEpoch": 33,
//                 "storageSize": 66034000
//             },
//             "deletable": false
//         },
//         "resourceOperation": {
//             "registerFromScratch": {
//                 "encodedLength": 66034000,
//                 "epochsAhead": 10
//             }
//         },
//         "cost": 96075000
//     }
// }

export const readBlob = async (blobId: string) => {
    const url = `${CONSTANTS.WALRUS.AGGREGATOR_URL}/v1/blobs/${blobId}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to read blob: ${response.status} ${response.statusText}`
        );
    }

    return await response.arrayBuffer();
};
