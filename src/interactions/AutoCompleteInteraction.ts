import { Client } from "..";
import { Base } from "./Base";

export class AutoCompleteInteraction extends Base {
    constructor(data: AutoCompleteInteractionData, client: Client) {
        super(data, client);
    }

    get id() {
        return this.data.data.id;
    }

    get commandName() {
        return this.data.data.name;
    }

    // @ts-expect-error - @Override as this is a different .options()
    get options(): InteractionOption[] {
        return this.data.data.options;
    }

    get focusedField() {
        return this.options.find((o) => o.focused);
    }

    async reply(data: AutoCompleteChoice[]) {
        await this.iwr(
            `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`,
            "post",
            {
                type: 0x8,
                data: {
                    choices: data ?? [],
                },
            }
        );
    }
}

export interface AutoCompleteInteractionData {
    type: 4;
    id: string;
    token: string;
    data: {
        id: string;
        name: string;
        type: number;
        version: string;
        options: {
            type: number;
            name: string;
            value: string;
            focused: boolean;
        }[];
    };
}

type AutoCompleteChoice = { name: string; value: string };
