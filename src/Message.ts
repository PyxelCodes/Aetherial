import { Client } from './Client';
import { Interaction, InteractionReplyData } from './Interaction';

export class Message {
    data: MessageData;
    interaction: Interaction;
    components: { type: number; components: MessageComponent }[];
    client: Client;

    createdTimestamp: number;

    constructor(data: MessageData, client: Interaction) {
        this.data = data;
        this.interaction = client;
        if (client) {
            if (Object.prototype.hasOwnProperty.call(client, 'client')) {
                this.client = client.client;
            } else {
                this.client = client as unknown as Client;
            }
        }
        this.createdTimestamp = new Date(this.data?.timestamp).getTime();
    }

    get embeds(): MessageEmbed[] {
        return this.data.embeds;
    }
    get attachments(): MessageAttachment[] {
        return this.data.attachments;
    }

    public static async edit(IMessage: Message, client: Client, data) {
        if (data?.attachments?.length) {
            await data.interaction.iwrFormData(
                data,
                `https://discord.com/api/v9/channels/${IMessage.channel}/messages/${IMessage.id}`,
                true
            );
        } else {
            await Interaction.iwr(
                `https://discord.com/api/v9/channels/${IMessage.channel}/messages/${IMessage.id}`,
                client,
                'patch',
                data
            );
        }
    }

    public async removeAttachments() {}

    public async staticEdit(
        channel_id: string,
        message_id: string,
        data: InteractionReplyData
    ) {
        await Interaction.iwr(
            `https://discord.com/api/v10/channels/${channel_id}/messages/${message_id}`,
            this.client,
            'patch',
            data
        );
    }

    public async edit(data: InteractionReplyData) {
        if (data?.files?.length) {
            await this.interaction.iwrFormData(
                data,
                `${this.interaction.url}/webhooks/${this.client.user.id}/${this.interaction.data.token}/messages/@original`,
                true
            );
        } else {
            await Interaction.iwr(
                `${this.interaction.url}/webhooks/${this.client.user.id}/${this.interaction.data.token}/messages/@original`,
                this.client,
                'patch',
                data
            );
        }
        return void 0;
    }

    public async reply(text: string) {
        let data = {
            content: text
        };

        await Interaction.iwr(
            `https://discord.com/api/v9/channels/${this.channel}/messages`,
            this.client,
            'post',
            data
        );
    }

    get id(): string {
        return this.data.id;
    }
    get author(): MessageAuthor {
        return this.data.author;
    }
    get content(): string {
        return this.data.content;
    }
    get channel(): string {
        return this.data.channel_id;
    }
    get guild(): string {
        return this.data.guild_id;
    }
}

export interface MessageData {
    id: string;
    type: number;
    content: string;
    channel_id: string;
    author: MessageAuthor;
    attachments: MessageAttachment[];
    embeds: MessageEmbed[];
    mentions: string[];
    mention_roles: string[];
    pinned: boolean;
    mention_everyone: boolean;
    tts: boolean;
    timestamp: string;
    edited_timestamp: string;
    flags: number;
    components: MessageComponent[];
    application_id: string;
    webhhook_id: string;
    interaction: MessageInteraction;
    guild_id?: string;
}

declare interface MessageAuthor {
    id: string;
    name: string;
    discriminator: string;
    avatar: string;
    bot: boolean;
    public_flags: number;
}
declare interface MessageAttachment {}
declare interface MessageEmbed {
    type: 'rich';
    description: string;
    author: MessageAuthor;
    color: number;
    fields: MessageEmbedField[];
}
declare interface MessageComponent {}
declare interface MessageInteraction {
    id: string;
    type: number;
    name: string;
    user: MessageAuthor;
}
declare interface MessageEmbedField {
    name: string;
    value: string;
    inline: boolean;
}
