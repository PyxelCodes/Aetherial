export class IMessageComponent<T> {
    public readonly custom_id: string;
    public readonly disabled: boolean;

    public setCustomId(custom_id: string): IMessageComponent<T>;
    public setDisabled(disabled?: boolean): IMessageComponent<T>;
}

export class IMessageButton extends IMessageComponent<IMessageButton> {
    public readonly type: 2;
    public readonly style: number;
    public readonly label: string;
    public readonly emoji: ISimpleEmoji;
    public readonly url: string;

    public setLabel(label: string): IMessageButton;
    public setEmoji(emoji: string): IMessageButton;
    public setUrl(url: string): IMessageButton;
    public setStyle(style: MessageButtonStyles): IMessageButton;
}
enum MessageButtonStyles {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4
}

export interface ISimpleEmoji {
    name: string;
    id: string;
}
