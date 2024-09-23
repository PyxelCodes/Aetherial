/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { Client } from "./Client";
import { InteractionOptions } from "./InteractionOptions";
import { Message, MessageData } from "./Message";
import { User } from "./User";
import {
    MessageActionRow,
    MessageComponentData,
} from "./classes/MessageActionRow";
import { MessageAttachment } from "./classes/MessageAttachment";
import { MessageEmbed, MessageEmbedData } from "./classes/MessageEmbed";
import { TextInput } from "./classes/Modal";
import { FastifyReply } from "fastify";
import { TextChannel } from "./TextChannel";
import { Http } from "./Http";

export class Interaction extends Http {
    data: InteractionData;
    res: FastifyReply;
    message: Message;
    options: InteractionOptions;
    client: Client;
    user: User;
    channel: TextChannel;
    deffered: boolean = false;
    createdTimestamp: number;
    replied: boolean = false;
    values?: string[];
    url = `https://discord.com/api/v9`;

    /**
     * Constructs a new instance of the Interaction class.
     * @constructor
     * @param interactionData - The interaction data.
     * @param res - The Fastify reply object.
     * @param client - The client object.
     */
    constructor(
        interactionData: InteractionData,
        res: FastifyReply,
        client: Client
    ) {
        super(client.token);
        this.data = interactionData; // @ts-ignore
        this.res = res;
        this.createdTimestamp = Date.now();
        this.options = new InteractionOptions(this.data.data, this);
        this.client = client;
        this.channel = new TextChannel(this);
        if (!this.data.member) {
            console.warn(
                `[Interaction] member is null -> ${this.data.id} -> command: ${
                    this.data?.data?.name || this.data?.data?.custom_id
                }`
            );
            // @ts-expect-error
            this.data.member = {};
        }
        this.user = new User(this.data.member.user);
        this.client.cache.addUser(this.user);
        if (!this.isCommand()) {
            //@ts-ignore
            this.message = new Message(this.data.message, this);
        }

        if (this.isSelectMenu()) {
            // @ts-ignore
            this.values = this.data.data.values;
        }
    }

    /**
     * Gets the guild ID associated with this interaction.
     *
     * @returns {string} The guild ID.
     */
    get guild() {
        // @ts-ignore
        //if (process.flags.state('debug')) return this.data.guildId;
        return this.data.guild_id;
    }

    /**
     * Gets the name of the command.
     * @returns {string} The name of the command.
     */
    get commandName() {
        // @ts-ignore
        //if (process.flags.state('debug')) return this.data.commandName;
        return this.data?.data?.name;
    }

    /**
     * Gets the custom ID of the interaction.
     *
     * @return {string} The custom ID of the interaction, or undefined if it is not available.
     */
    get customId() {
        return this.data?.data?.custom_id;
    }

    // This is used for backend tampering to allow redirection of button commands to the command handler
    /**
     * Sets the name of the command.
     *
     * @param name - The name of the command.
     */
    set commandName(name: string) {
        this.data.data.name = name;
    }

    /**
     * Sets the custom ID for the interaction.
     *
     * @param id - The custom ID to set.
     */
    set customId(id: string) {
        this.data.data.custom_id = id;
    }

    /**
     * Checks if the interaction is a command.
     * @returns {boolean} Returns true if the interaction is a command, otherwise false.
     */
    public isCommand(): this is Interaction {
        // @ts-ignore
        //if (process.flags.state('debug')) return this.data.isCommand();
        return this.data.type == 2;
    }

    /**
     * Checks if the interaction is a button.
     * @returns {boolean} Returns true if the interaction is a button, otherwise false.
     */
    public isButton(): boolean {
        // @ts-ignore
        //if (process.flags.state('debug')) return this.data.isButton();
        return this.data.type == 3 && this.data.data.component_type == 2;
    }

    /**
     * Checks if the interaction is a modal submit.
     * @returns {boolean} Returns true if the interaction is a modal submit, otherwise false.
     */
    public isModalSubmit(): boolean {
        // @ts-ignore
        //if (process.flags.state('debug')) return this.data.isModalSubmit();
        return this.data.type == 5;
    }

    /**
     * Checks if the interaction is a select menu.
     * @returns {boolean} True if the interaction is a select menu, false otherwise.
     */
    public isSelectMenu(): boolean {
        // @ts-ignore
        //if (process.flags.state('debug')) return this.data.isSelectMenu();
        return (
            this.data.type == 3 &&
            [
                3 /* String */, 5 /* User */, 6 /* Role */, 7 /* Mentionable */,
                8 /* Channel */,
            ].includes(this.data.data.component_type)
        );
    }

    /**
     * Displays a modal dialog for interaction.
     *
     * @param {TextInput} data - The text input data for the modal dialog.
     * @returns A promise that resolves when the modal dialog is closed.
     */
    async showModal(data: TextInput) {
        await this.iwr(
            `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`,
            "post",
            {
                type: 0x9, //0x9 type -> APPLICATION_MODAL,
                data,
            }
        );
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

        this.replied = true;

        if (data.files) {
            let callback = await this.iwrFiles(
                data,
                `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`
            );
            let msg = new Message(callback.data.resource.message, this);
            msg.client = this.client;
            return msg;
        } else {
            try {
                let callback = await this.iwr(
                    `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`,
                    "post",
                    {
                        type: 4, // 0x4 type -> CHANNEL_MESSAGE_WITH_SOURCE
                        // @ts-ignore
                        data: Interaction.parseMessage(data),
                    },
                    { with_response: true }
                );

                return new Message(callback.data.resource.message, this);

                // console.log(callback.data)
            } catch (error) {
                console.log((error as AxiosError).response.data);
            }
        }
    }

    async replyAutocomplete(data: InteractionReplyData) {
        await this.iwr(`${this.url}/interactions/${this.data.id}/${this.data.token}/callback`, "post", data);
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
     * Updates the interaction with the provided data.
     *
     * @param {InteractionReplyData} data - The data to update the interaction with.
     * @returns void
     */
    async update(data: InteractionReplyData): Promise<void> {
        await this.iwr(`${this.url}/interactions/${this.data.id}/${this.data.token}/callback`, "post", { type: 0x7, data: Interaction.parseMessage(data) });
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
            Interaction.parseMessage(data)
        );
        const msg = new Message(callback.data, this);
        return msg;
    }

    /**
     * Defers the interaction response.
     *
     * This method sends a deferred response to the interaction, indicating that the bot is still processing the request.
     *
     * It sets the `type` property of the response to `0x5` (DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE).
     *
     * It also sets the `deffered` property of the class instance to `true`.
     */
    async defer() {
        await this.iwr(`${this.url}/interactions/${this.data.id}/${this.data.token}/callback`, "post", { type: 0x5 });
        this.deffered = true;
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
        await this.iwr(`${this.url}/interactions/${this.data.id}/${this.data.token}/callback`, "post", { type: 0x6 });
        this.deffered = true;
    }

    /**
     * Suspends the execution of the current function for the specified number of milliseconds.
     * @param {number} ms - The number of milliseconds to sleep.
     * @returns A promise that resolves after the specified number of milliseconds.
     */
    sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
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
                            Interaction.parseEmbed(e as MessageEmbed)
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

    private avatarURL(): string {
        return `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`;
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
declare interface InteractionOption {
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
    components?: MessageActionRow<any>[];
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
    attachments?: any[];
}
