import { MessageComponent } from './MessageComponent';

export class MessageSelectMenu extends MessageComponent<MessageSelectMenu> {
    type: number;
    options: MessageSelectMenuOptions[];
    placeholder: string;
    min_values: number;
    max_values: number;

    constructor() {
        super(null);
        this.options = [];
        this.type = 3;
    }

    public setOptions(options: MessageSelectMenuOptions[]) {
        for (const i in options) {
            options[i] = this.formatOption(options[i]);
        }
        this.options = options;
        return this;
    }

    public formatOption(option: MessageSelectMenuOptions) {
        if (option.emoji) { // @ts-expect-error The api wants it like this -> type mismatch
            option.emoji = {
                name: option.emoji.match(/([a-zA-Z_])+/gm)[0],
                id: option.emoji.match(/([0-9])+/gm)[0]
            };
        }

        return option;
    }

    public setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }

    public addOptions(...options: MessageSelectMenuOptions[]) {
        for (const i in options) {
            options[i] = this.formatOption(options[i]);
        }
        this.options = this.options.concat(options);
        return this;
    }

    public addOption(option: MessageSelectMenuOptions) {
        option = this.formatOption(option);
        this.options.push(option);
        return this;
    }

    public setMinValues(min_values: number) {
        this.min_values = min_values;
        return this;
    }

    public setMaxValues(max_values: number) {
        this.max_values = max_values;
        return this;
    }

    public setMinMax(min_values: number, max_values: number) {
        this.setMinValues(min_values);
        this.setMaxValues(max_values);
        return this;
    }

    public toJSON() {
        return {
            type: this.type,
            options: this.options,
            placeholder: this.placeholder,
            custom_id: this.custom_id,
            disabled: this.disabled,
            min_values: this.min_values,
            max_values: this.max_values
        };
    }
}

declare interface MessageSelectMenuOptions {
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
}
