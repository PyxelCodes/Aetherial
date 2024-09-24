import { IMessageComponent } from "./types";

export class MessageComponent<T> implements IMessageComponent<T> {
    custom_id: string;
    disabled: boolean = false;

    constructor(customId: string) {
        this.custom_id = customId;
    }

    public setCustomId(custom_id: string) {
        this.custom_id = custom_id;
        return this;
    }

    public setDisabled(disabled: boolean = true) {
        this.disabled = disabled;
        return this;
    }

    public parseEmoji(emoji: string) {
        if (!emoji) {
            console.log(`INVALID_EMOJI - Emoji cannot be empty`);
            return null;
        }

        const unicodeEmojiRegex =
            /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}]+$/u;
        const emojiWithIdRegex = /^<:([a-zA-Z_]+):(\d+)>$/;
        const emojiNameOnlyRegex = /^:([a-zA-Z_]+):$/;

        if (emoji.match(unicodeEmojiRegex)) {
            // Case: Unicode emoji
            return { id: null, name: emoji };
        }

        const emojiWithIdMatch = emoji.match(emojiWithIdRegex);
        if (emojiWithIdMatch) {
            // Case: <emoji_name:id>
            return { id: emojiWithIdMatch[2], name: emojiWithIdMatch[1] };
        }

        const emojiNameOnlyMatch = emoji.match(emojiNameOnlyRegex);
        if (emojiNameOnlyMatch) {
            // Case: :emoji_name:
            return { id: null, name: emojiNameOnlyMatch[1] };
        }

        // If none of the cases matched, return INVALID_EMOJI
        console.log(`INVALID_EMOJI - Invalid emoji format: ${emoji}`);
        return null;
    }
}
