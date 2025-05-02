module mandy::mandy {
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use mandy::utils::is_prefix;
    use sui::event;

    const EInvalidDeliveryTime: u64 = 0;
    const EInvalidRecipients: u64 = 1;
    const ENoAccess: u64 = 2;
    const EDeliveryTimeNotReached: u64 = 3;
    const ELetterNotExists: u64 = 4;

    public struct PostOffice has key {
        id: UID,
        letters: Table<u64, Letter>,
        letter_count: u64,
        user_created_letters: Table<address, vector<u64>>,
        user_received_letters: Table<address, vector<u64>>
    }

    public struct Letter has store {
        letter_id: u64,
        title: String,
        content: String,
        sender: address,
        recipients: vector<address>,
        delivery_time_ms: u64,
        file_name: String,
        attach_blob_id: String,
        created_at: u64,
        is_public: bool
    }

    public struct EventLetterCreated has copy, drop {
        letter_id: u64,
        sender: address,
        title: String,
        content: String,
        recipients: vector<address>,
        delivery_time_ms: u64,
        file_name: String,
        attach_blob_id: String,
        is_public: bool
    }

    fun init(ctx: &mut TxContext) {
        let post_office = PostOffice {
            id: object::new(ctx),
            letters: table::new(ctx),
            letter_count: 0,
            user_created_letters: table::new(ctx),
            user_received_letters: table::new(ctx)
        };

        transfer::share_object(post_office);
    }

    public entry fun create_letter(
        post_office: &mut PostOffice,
        title: vector<u8>,
        content: vector<u8>,
        recipients: vector<address>,
        delivery_time_ms: u64,
        file_name: vector<u8>,
        attach_blob_id: vector<u8>,
        is_public: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Check that the recipient list is not empty
        assert!(
            !vector::is_empty(&recipients),
            EInvalidRecipients
        );

        // Check that delivery time must be greater than current time
        let current_time = clock::timestamp_ms(clock);
        assert!(
            delivery_time_ms > current_time,
            EInvalidDeliveryTime
        );

        // Create letter object
        let letter = Letter {
            letter_id: post_office.letter_count,
            title: string::utf8(title),
            content: string::utf8(content),
            sender: ctx.sender(),
            recipients,
            delivery_time_ms,
            file_name: string::utf8(file_name),
            attach_blob_id: string::utf8(attach_blob_id),
            created_at: current_time,
            is_public
        };

        event::emit(
            EventLetterCreated {
                letter_id: post_office.letter_count,
                sender: ctx.sender(),
                title: string::utf8(title),
                content: string::utf8(content),
                recipients,
                delivery_time_ms,
                file_name: string::utf8(file_name),
                attach_blob_id: string::utf8(attach_blob_id),
                is_public
            }
        );

        // Add the letter to the post office's letter table
        let letter_id = post_office.letter_count;
        table::add(
            &mut post_office.letters,
            letter_id,
            letter
        );
        post_office.letter_count = letter_id + 1;

        // Add the letter to the user's letter table
        let sender = ctx.sender();
        let exists = table::contains(
            &post_office.user_created_letters,
            sender
        );
        if (!exists) {
            table::add(
                &mut post_office.user_created_letters,
                sender,
                vector::empty()
            );
        };
        let user_letter_ids = table::borrow_mut(
            &mut post_office.user_created_letters,
            sender
        );
        vector::push_back(user_letter_ids, letter_id);

        // Add the letter to the user's received letter table
        let recipients_count = vector::length(&recipients);
        let mut i = 0_u64;
        while (i < recipients_count) {
            let recipient = recipients[i];
            let exists = table::contains(
                &post_office.user_received_letters,
                recipient
            );
            if (!exists) {
                table::add(
                    &mut post_office.user_received_letters,
                    recipient,
                    vector::empty()
                );
            };

            let recipient_letter_ids = table::borrow_mut(
                &mut post_office.user_received_letters,
                recipient
            );
            vector::push_back(recipient_letter_ids, letter_id);

            i = i + 1;
        };
    }

    /// All allowlisted addresses can access all IDs with the prefix of the allowlist
    fun approve_internal(
        caller: address,
        id: vector<u8>,
        post_office: &PostOffice,
        letter_id: u64,
        clock: &Clock
    ): bool {

        // Check if the id has the right prefix
        if (!is_prefix(post_office.id.to_bytes(), id)) {
            return false
        };

        assert!(
            table::contains(&post_office.letters, letter_id),
            ELetterNotExists
        );
        let letter = table::borrow(&post_office.letters, letter_id);

        // The mail sender can directly decrypt and view the mail
        if (letter.sender == caller) {
            return true
        };

        // Check if the delivery time has been reached
        let current_time = clock::timestamp_ms(clock);
        assert!(
            current_time >= letter.delivery_time_ms,
            EDeliveryTimeNotReached
        );

        // Check if the letter is public
        if (letter.is_public) {
            return true
        };

        letter.recipients.contains(&caller)
    }

    entry fun seal_approve(
        id: vector<u8>,
        post_office: &PostOffice,
        letter_id: u64,
        clock: &Clock,
        ctx: &TxContext
    ) {

        assert!(
            approve_internal(
                ctx.sender(),
                id,
                post_office,
                letter_id,
                clock
            ),
            ENoAccess
        );
    }
}
