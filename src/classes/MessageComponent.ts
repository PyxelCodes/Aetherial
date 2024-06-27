import { IMessageComponent } from './types';

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
}
