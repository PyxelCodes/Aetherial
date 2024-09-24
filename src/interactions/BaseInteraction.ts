import { FastifyReply } from "fastify";
import {
    Client,
    InteractionOptions,
    Message,
    MessageActionRow,
    MessageAttachment,
    MessageEmbed,
    User,
} from "..";
import { AxiosError } from "axios";
import { MessageEmbedData } from "../classes/MessageEmbed";
import { MessageComponentData } from "../classes/MessageActionRow";
import { MessageData } from "../Message";
import { Base, InteractionDataLike } from "./Base";


export class BaseInteraction extends Base {
    data: InteractionDataLike;
    res: FastifyReply;
    client: Client;
    readonly replied: boolean = false;
    readonly deffered: boolean = false;
    readonly createdTimestamp: number;
    options: InteractionOptions;
    user: User;

    constructor(data: InteractionDataLike, res: FastifyReply, client: Client) {
        super(data, client);
        this.createdTimestamp = Date.now();
        this.res = res;
        this.data = data;
        this.client = client;
        this.options = new InteractionOptions(this.data.data, this);

        this.data = data as InteractionData;
        this.user = new User(this.data.member.user);
        this.client.cache.addUser(this.data.member.user);
    }

    /**
     * Sends a reply to the interaction.
     *
     * @param {InteractionReplyData} data - The data for the reply.
     * @param {boolean} replied - Optional flag indicating if the interaction has already been replied to.
     * @returns {Promise<Message>} A Promise that resolves to the sent message.
     */
    async reply(data: InteractionReplyData): Promise<Message> {
        if (data.ephemeral) data.flags = 1 << 6;

        if (this.replied || this.deffered) {
            return await this.editReply(data);
        }
        Reflect.set(this, "replied", true);

        if (data.files) {
            const callback = await this.iwrFiles(
                data,
                `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`
            );
            const msg = new Message(callback.data.resource.message, this);
            msg.client = this.client;
            return msg;
        } else {
            try {
                const callback = await this.iwr(
                    `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`,
                    "post",
                    {
                        type: 4, // 0x4 type -> CHANNEL_MESSAGE_WITH_SOURCE
                        data: BaseInteraction.parseMessage(data),
                    },
                    { with_response: true }
                );

                return new Message(callback.data.resource.message, this);
            } catch (error) {
                console.log((error as AxiosError).response.data);
            }
        }
    }

    /**
     * Edits the reply of the interaction.
     * @param {InteractionReplyData} data - The data to be edited.
     * @returns  A Promise that resolves when the reply is edited.
     */
    async editReply(data: InteractionReplyData): Promise<Message> {
        if (data.ephemeral) data.flags = 64;

        try {
            let callback: { data: MessageData };
            if (data.files) {
                callback = await this.iwrFiles(
                    data,
                    `${this.url}/webhooks/${this.client.user.id}/${this.data.token}/messages/@original`,
                    true
                );
            } else {
                callback = await this.iwr(
                    `${this.url}/webhooks/${this.client.user.id}/${this.data.token}/messages/@original`,
                    "patch",
                    data
                );
            }

            return new Message(callback.data, this);
        } catch (error) {
            console.log((error as AxiosError).response.data);
        }
    }

    /**
     * Deletes the reply message.
     *
     * @returns A promise that resolves when the reply message is successfully deleted.
     */
    async deleteReply(): Promise<void> {
        await this.iwr(
            `${this.url}/webhooks/${this.client.user.id}/${this.data.token}/messages/@original`,
            "delete"
        );
    }

    /**
     * Sends a follow-up message in response to an interaction.
     * @param {InteractionReplyData} data - The data for the follow-up message.
     * @returns A Promise that resolves to the fetched reply
     */
    async followUp(data: InteractionReplyData): Promise<Message> {
        if (data.ephemeral) data.flags = 64;
        const callback = await this.iwr(
            `${this.url}/webhooks/${this.client.user.id}/${this.data.token}`,
            "post",
            BaseInteraction.parseMessage(data)
        );
        const msg = new Message(callback.data, this);
        return msg;
    }

    /**
     * Defers the update message.
     *
     * Sends a deferred update message to the client.
     *
     * It sets the `type` property of the response to `0x6` (DEFERRED_UPDATE_MESSAGE).
     *
     * Sets the `deffered` flag to true.
     */
    async deferUpdate(): Promise<void> {
        await this.iwr(
            `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`,
            "post",
            { type: 0x6 }
        );
        Reflect.set(this, "deffered", true);
    }

    /**
     * Parses the given `msg` object and returns a formatted `InteractionReplyFormatted` object.
     * This function extracts embeds, components, and attachments from the `msg` object and formats them accordingly.
     *
     * @param {InteractionReplyData} msg - The `InteractionReplyData` object to be parsed.
     * @returns {InteractionReplyFormatted} The formatted `InteractionReplyFormatted` object.
     */
    static parseMessage(msg: InteractionReplyData): InteractionReplyFormatted {
        const data: InteractionReplyFormatted = {} as InteractionReplyFormatted;
        // Parse embeds, components and attachments

        //fallback
        if (typeof msg === "string") {
            return { content: msg };
        }

        for (const i in msg) {
            if (i === "embeds" || i === "components" || i === "attachments") {
                data[i] = [];

                if (msg[i].length > 0 && msg[i][0] == undefined) continue;

                for (const e of msg[i]) {
                    if (i === "embeds")
                        data.embeds.push(
                            BaseInteraction.parseEmbed(e as MessageEmbed)
                        );
                    if (i === "components")
                        data.components.push(
                            e.toJSON() as MessageComponentData
                        );
                    //if(i === 'attachments') data.attachments.push(e.toJSON());
                }
            } else data[i] = msg[i];
        }

        return data;
    }

    /**
     * Parses a MessageEmbed object and returns its JSON representation.
     *
     * @param {MessageEmbed} embed - The MessageEmbed object to parse.
     * @returns {MessageEmbedData} The JSON representation of the embed.
     */
    static parseEmbed(embed: MessageEmbed): MessageEmbedData {
        return embed.toJSON();
    }
}

/**
 * Represents the data structure for an interaction.
 */
export interface InteractionData {
    id: string; // Unique ID of command
    type?: number;
    application_id: string;
    guild_id?: string;
    channel_id?: string;
    locale: string;
    options?: InteractionAutocompleteOption[];
    data: {
        guild_id: string;
        name: string;
        id: string;
        options?: InteractionOption[];
        type: number;
        component_type?: number;
        custom_id?: string;
    };
    default_member_permissions?: string[];
    dm_permission?: boolean;
    default_permission?: boolean;
    version: string;
    token: string;
    member: {
        avatar: string;
        deaf: boolean;
        flags: number;
        is_pending: boolean;
        joined_at: string;
        mute: boolean;
        nick: string;
        pending: boolean;
        permissions: string;
        roles: string[];
        user: {
            avatar: string;
            discriminator: string;
            id: string;
            public_flags: number;
            username: string;
            tag: string;
        };
    };
    components?: {
        type: number;
        custom_id: string;
        style: number;
        label: string;
        emoji: {
            id: string;
            name: string;
            animated: boolean;
        };
        url: string;
        disabled: boolean;
        components?: {
            type: number;
            custom_id: string;
            value: string;
            style: number;
            label: string;
            emoji: {
                id: string;
                name: string;
                animated: boolean;
            };
            url: string;
            disabled: boolean;
        }[];
    }[];
}

/**
 * Represents an interaction option.
 * @interface
 */
export interface InteractionOption {
    type: number;
    name: string;
    description: string;
    required: boolean;
    choices: InteractionOptionChoice[];
    options: InteractionOption[];
    channel_types: number[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    autocomplete?: boolean;
    // Types for autocomplete interactiontype
    focused?: boolean;
    value?: string;
}

/**
 * Represents an autocomplete option for an interaction.
 */
declare interface InteractionAutocompleteOption {
    focused: boolean;
    name: string;
    type: number;
    value: string;
}

/**
 * Represents an option choice for an interaction.
 */
declare interface InteractionOptionChoice {
    name: string;
    value: string | number;
}

/**
 * Represents the data for an interaction reply.
 */
export interface InteractionReplyData {
    ephemeral?: boolean;
    flags?: number;
    content?: string;
    embeds?: MessageEmbed[];
    components?: MessageActionRow<any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    files?: MessageAttachment[];
    attachments?: MessageAttachment[];
}

/**
 * Represents the formatted reply for an interaction.
 */
declare interface InteractionReplyFormatted {
    ephemeral?: boolean;
    flags?: number;
    content?: string;
    embeds?: MessageEmbedData[];
    components?: MessageComponentData[];
    attachments?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}
