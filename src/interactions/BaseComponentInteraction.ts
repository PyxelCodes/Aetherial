import { FastifyReply } from "fastify";
import { InteractionDataLike } from "./Base";
import { BaseInteraction } from "./BaseInteraction";
import { Client, Message, TextChannel } from "..";

export class BaseComponentInteraction extends BaseInteraction {
    message: Message;
    channel: TextChannel;

    constructor(data: InteractionDataLike, res: FastifyReply, client: Client) {
        super(data, res, client);

        // @ts-expect-error - types still need to be redone
        this.message = new Message(this.data.message, this);
        this.channel = new TextChannel(this);
    }

    get customId() {
        return this.data.data.custom_id;
    }
}