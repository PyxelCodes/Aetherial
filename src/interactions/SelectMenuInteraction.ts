import { FastifyReply } from "fastify";
import { Client, Message } from "..";
import { BaseInteraction, InteractionData } from "./BaseInteraction";

export class SelectMenuInteraction extends BaseInteraction {
    message: Message;
    constructor(data: InteractionData, res: FastifyReply, client: Client) {
        super(data, res, client);
        // @ts-expect-error - types still need to be redone
        this.message = new Message(this.data.message, this);
    }

    get values() {
        // @ts-expect-error - types still need to be redone
        return this.data.data.values;
    }
}
