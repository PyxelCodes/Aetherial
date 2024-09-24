import { MessageComponent } from "./MessageComponent";
import { IMessageButton } from "./types";

export class MessageButton
    extends MessageComponent<MessageButton>
    implements IMessageButton
{
    readonly type = 2;
    style: number;
    label: string;
    emoji: { name: string; id: string };
    url: string;

    constructor() {
        super(null);
    }

    public setLabel(label: string) {
        this.label = label;
        return this;
    }

    public setEmoji(emoji: string) {
        if (!emoji) return this;

        const unicodeEmojiRegex =
            /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}]+$/u;
        const emojiWithIdRegex = /^<([a-zA-Z_]+):(\d+)>$/;
        const emojiNameOnlyRegex = /^:([a-zA-Z_]+):$/;

        if (emoji.match(unicodeEmojiRegex)) {
            // Case: Unicode emoji
            this.emoji = { id: null, name: emoji };
            return this;
        }

        const emojiWithIdMatch = emoji.match(emojiWithIdRegex);
        if (emojiWithIdMatch) {
            // Case: <emoji_name:id>
            this.emoji = { id: emojiWithIdMatch[2], name: emojiWithIdMatch[1] };
            return this;
        }

        const emojiNameOnlyMatch = emoji.match(emojiNameOnlyRegex);
        if (emojiNameOnlyMatch) {
            // Case: :emoji_name:
            this.emoji = { id: null, name: emojiNameOnlyMatch[1] };
            return this;
        }

        // If none of the cases matched, return this unchanged
        return this;
    }

    public setUrl(url: string) {
        this.url = url;
        return this;
    }

    public setStyle(style: number | string) {
        if (typeof style === "string") {
            switch (style) {
                case "PRIMARY":
                    style = 1;
                    break;

                case "SECONDARY":
                    style = 2;
                    break;

                case "SUCCESS":
                    style = 3;
                    break;

                case "DANGER":
                    style = 4;
                    break;

                default:
                    style = 1;
            }
        }

        this.style = style;
        return this;
    }

    public toJSON() {
        if (this.url) {
            return {
                type: this.type,
                style: 5,
                label: this.label,
                emoji: this.emoji,
                url: this.url,
                disabled: this.disabled,
            };
        } else
            return {
                type: this.type,
                style: this.style,
                label: this.label,
                emoji: this.emoji,
                custom_id: this.custom_id,
                url: this.url,
                disabled: this.disabled,
            };
    }
}
