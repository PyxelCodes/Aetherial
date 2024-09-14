import { Client } from './Client';
import { Interaction, InteractionReplyData } from './Interaction';

/**
 * Represents a message in a Discord
 */
export class Message {

    data: MessageData;
    interaction: Interaction;
    components: { type: number; components: MessageComponent }[];
    client: Client;
    createdTimestamp: number;

    /**
     * Constructs a new Message object.
     * 
     * @constructor
     * @param data - The data for the message.
     * @param client - The interaction client.
     */
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

    /**
     * Gets the embeds of the message.
     * @returns {MessageEmbed[]} An array of MessageEmbed objects representing the embeds of the message.
     */
    get embeds(): MessageEmbed[] {
        return this.data.embeds;
    }

    /**
     * Gets the attachments of the message.
     * @returns An array of MessageAttachment objects representing the attachments.
     */
    get attachments(): MessageAttachment[] {
        return this.data.attachments;
    }

    /**
     * Edits a message.
     * @async
     * @public
     * @static
     * @param IMessage - The message to edit.
     * @param client - The client object.
     * @param data - The data to update the message with.
     * @returns A promise that resolves when the message is edited.
     */
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

    /**
     * Removes attachments from the message.
     * 
     * @async
     * @public
     * @returns {Promise<void>} A promise that resolves when the attachments are removed.
     */
    public async removeAttachments() { }

    /**
     * Edits a message in a channel.
     * 
     * @async
     * @public
     * @param channel_id - The ID of the channel where the message is located.
     * @param message_id - The ID of the message to be edited.
     * @param data - The updated data for the message.
     * @returns {Promise<void>} A promise that resolves when the message is successfully edited.
     */
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

    /**
     * Edits the message with the provided data.
     * 
     * @async
     * @public
     * @param data - The data to update the message with.
     * @returns A Promise that resolves when the message is successfully edited.
     */
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

    /**
     * Sends a reply message to the channel.
     * 
     * @async
     * @public
     * @param text The text content of the reply message.
     * @returns {Promise<void>} A promise that resolves when the reply message is sent.
     */
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

    /**
     * Gets the ID of the message.
     *
     * @public
     * @readonly
     * @returns {string} The ID of the message.
     */
    get id(): string {
        return this.data.id;
    }

    /**
     * Gets the author of the message.
     *
     * @public
     * @readonly
     * @returns {MessageAuthor} The author of the message.
     */
    get author(): MessageAuthor {
        return this.data.author;
    }

    /**
     * Gets the content of the message.
     *
     * @public
     * @readonly
     * @returns {string} The content of the message as a string.
     */
    get content(): string {
        return this.data.content;
    }

    /**
     * Gets the channel ID.
     *
     * @public
     * @readonly
     * @returns {string} The channel ID.
     */
    get channel(): string {
        return this.data.channel_id;
    }

    /**
     * Retrieves the guild ID associated with this message.
     * 
     * @public
     * @readonly
     * @returns {string} The guild ID as a string.
     */
    get guild(): string {
        return this.data.guild_id;
    }
}

/**
 * Represents the data structure of a message.
 */
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

/**
 * Represents the author of a message.
 */
declare interface MessageAuthor {
    id: string;
    name: string;
    discriminator: string;
    avatar: string;
    bot: boolean;
    public_flags: number;
}

/**
 * Represents a message attachment.
 */
declare interface MessageAttachment { }

/**
 * Represents a message embed.
 */
declare interface MessageEmbed {
    type: 'rich';
    description: string;
    author: MessageAuthor;
    color: number;
    fields: MessageEmbedField[];
}

/**
 * Represents a message component.
 */
declare interface MessageComponent { }

/**
 * Represents an interaction within a message.
 * id {string}
 */
declare interface MessageInteraction {
    id: string;
    type: number;
    name: string;
    user: MessageAuthor;
}

/**
 * Represents a field in a message embed.
 */
declare interface MessageEmbedField {
    name: string;
    value: string;
    inline: boolean;
}
