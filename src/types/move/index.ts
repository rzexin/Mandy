export type UserGoalIds = {
    id: {
        id: string;
    };
    name: string;
    value: string[];
};

export type DynamicFields = {
    type: string;
    fields: {
        id: {
            id: string;
        };
        size: string;
    };
};

export type PostOfficeFields = {
    letter_count: number;
    letters: DynamicFields;
    user_created_letters: DynamicFields;
    user_received_letters: DynamicFields;
};

export type LetterFields = {
    fields: LetterDetail;
};

export type LetterData = {
    type: string;
    fields: LetterDetail;
};

export type LetterDetail = {
    letter_id: number;
    title: string;
    content: string;
    sender: string;
    recipients: string[];
    delivery_time_ms: string;
    file_name: string;
    attach_blob_id: string;
    status: number;
    created_at: string;
    is_public: boolean;
};

// {
//     "type": "0xd204bff27df4fecb6c5926ae2cb4cc4f434c7843385a8b4a0e456d7858ee042f::mandy::Letter",
//     "fields": {
//       "attach_blob_id": "",
//       "content": "sadfadsdsf",
//       "created_at": "1745550747299",
//       "delivery_time_ms": "1745637140456",
//       "is_public": false,
//       "letter_id": "2",
//       "recipients": [
//         "0xf27c78ec343d35f68149d4b42fcde645dfec3844d4265b5674b348bdb0ba05cc",
//         "0x39ba7a5d7cbe921a5cdd76293345fd1e9ebbad354606edbfe1778eba80709de2",
//         "0xea6119766b2d252b4f6591293d16a30207235e32dbd9c664f787dfcc94a55be2"
//       ],
//       "sender": "0xf27c78ec343d35f68149d4b42fcde645dfec3844d4265b5674b348bdb0ba05cc",
//       "status": 0,
//       "title": "safdsafds"
//     }
//   }
