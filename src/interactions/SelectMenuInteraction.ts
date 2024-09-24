import { FastifyReply } from "fastify";
import { Client } from "..";
import { InteractionData } from "./BaseInteraction";
import { BaseComponentInteraction } from "./BaseComponentInteraction";

export class SelectMenuInteraction extends BaseComponentInteraction {
    constructor(data: InteractionData, res: FastifyReply, client: Client) {
        super(data, res, client);
    }

    get values() {
        // @ts-expect-error - types still need to be redone
        return this.data.data.values;
    }
}
