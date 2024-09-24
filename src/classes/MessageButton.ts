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
        this.emoji = this.parseEmoji(emoji) ?? undefined;

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
