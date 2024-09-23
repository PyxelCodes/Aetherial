import axios from "axios";
import { Shard } from "./Shard";
import { InteractionCreateData } from "./events/INTERACTION_CREATE";
import { Message } from "../Message";
import { Http } from "../Http";
import { BaseInteraction, InteractionReplyData } from "../interactions/BaseInteraction";

export class ShardInteraction extends Http {
    created_at: number;
    client: Shard;
    data: InteractionCreateData;
    replied = false;
    createdTimestamp: number = Date.now();

    message?: Message;

    url = `https://discord.com/api/v10`;

    constructor(data: InteractionCreateData, shard: Shard) {
        super(shard.client.token);
        this.data = data;
        this.created_at = Date.now();
        this.client = shard;
        //TODO: this.channel = new TextChannel(data.channel);
        //TODO: this.guild = new Guild(data.guild);
        //TODO: this.user = new User(data.member.user);
        //TODO: this.member = new Member(data.member);

        //TODO isCommand()
    }

    get commandName() {
        return this.data.data.name;
    }

    async reply(data: InteractionReplyData) {
        if (data.ephemeral) data.flags = 1 << 6;

        if (this.replied) {
            // TODO;
        }

        this.replied = true;

        // TODO; data.files

        const callback = await axios.post(
            `https://discord.com/api/v9/interactions/${this.data.id}/${this.data.token}/callback`,
            { type: 0x4, data: BaseInteraction.parseMessage(data) },
            { headers: { Authorization: `Bot ${this.client.token}` } }
        );

        if (callback?.data?.resource?.message) {
            return new Message(callback.data.resource.message, this);
        }
    }

    async editReply(data: InteractionReplyData) {
        if (data.ephemeral) data.flags = 1 << 6;
        try {
            await axios.patch(
                `${this.url}/webhooks/${this.client.user.id}/${this.data.token}/messages/@original`,
                data,
                { headers: { Authorization: `Bot ${this.client.token}` } }
            );
        } catch (error) {
            console.error(error);
        }
    }

    async fetchReply() {
        const msg = await this.RESTfetchReply();
        if (msg == null) return null;
        this.message = new Message(msg, this);
        this.message.client = this.client.client;
        return this.message;
    }

    async RESTfetchReply() {
        let req;
        try {
            req = await axios.get(
                `${this.url}/webhooks/${this.client.user.id}/${this.data.token}/messages/@original`
            );
        } catch (error) {
            console.error(error);
            return null;
        }
        return req.data;
    }
}
