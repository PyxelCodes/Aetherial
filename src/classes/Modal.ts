import { MessageComponent } from './MessageComponent';

export class TextInput extends MessageComponent<TextInput> {
    label: string;
    placeholder: string;
    required: boolean = false;
    title: string;

    constructor() {
        super(null);
    }

    public setLabel(label: string) {
        this.label = label;
        return this;
    }

    public setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }

    public setRequired(required: boolean = true) {
        this.required = required;
        return this;
    }

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public toJSON() {
        return {
            title: this.title,
            custom_id: this.custom_id,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: this.custom_id,
                            label: this.label,
                            style: 1,
                            min_length: 1,
                            max_length: 200,
                            placeholder: this.placeholder,
                            required: this.required
                        }
                    ]
                }
            ]
        };
    }
}
