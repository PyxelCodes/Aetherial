import { FastifyReply } from "fastify";
import { Client, InteractionData, Message, TextChannel } from "..";
import { BaseInteraction, InteractionReplyData } from "./BaseInteraction";

export class CommandInteraction extends BaseInteraction {
    data: InteractionData;
    res: FastifyReply;
    client: Client;
    channel: TextChannel;
    message?: Message;

    constructor(data: InteractionData, res: FastifyReply, client: Client) {
        super(data, res, client);
        this.data = data;
        this.res = res;
        this.client = client;
        this.channel = new TextChannel(this);
    }

    async reply(data: InteractionReplyData) {
        const s = await super.reply(data);
        this.message = s;
        return s;
    }

    async editReply(data: InteractionReplyData) {
        const s = await super.editReply(data);
        this.message = s;
        return s;
    }

    get guild() {
        return this.data.guild_id;
    }

    get commandName() {
        return this.data.data.name;
    }

    get customId() {
        return this.data.data.custom_id;
    }

    set commandNmae(name: string) {
        this.data.data.name = name;
    }
}
