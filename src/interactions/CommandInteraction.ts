import { FastifyReply } from "fastify";
import { Client, InteractionData, TextChannel } from "..";
import { BaseInteraction } from "./BaseInteraction";

export class CommandInteraction extends BaseInteraction {
    data: InteractionData;
    res: FastifyReply;
    client: Client;
    channel: TextChannel;

    constructor(data: InteractionData, res: FastifyReply, client: Client) {
        super(data, res, client);
        this.data = data;
        this.res = res;
        this.client = client;
        this.channel = new TextChannel(this);
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