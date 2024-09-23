import { FastifyReply } from "fastify";
import { Client, InteractionData } from "..";
import { BaseInteraction } from "./BaseInteraction";

export class AutoCompleteInteraction extends BaseInteraction {
    constructor(data: InteractionData, res: FastifyReply, client: Client) {
        super(data, res, client);
    }

    // @ts-expect-error - @Override as this is a different .options()
    get options(): InteractionOption[] {
        return this.data.data.options;
    }

    get focusedField() {
        return this.options.find((o) => o.focused);
    }

    // @ts-expect-error - @Override as this is a different .reply()
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

type AutoCompleteChoice = { name: string; value: string };
