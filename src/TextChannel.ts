import { Interaction, InteractionReplyData, Message } from ".";

/**
 * Represents a text channel in a Discord interaction.
 */
export class TextChannel {
    interaction: Interaction;
    id: string;

    constructor(parent: Interaction) {
        this.interaction = parent;
        this.id = parent.data.channel_id;
    }

    /**
     * Sets the channel ID.
     * 
     * @param {string} id - The ID of the channel.
     */
    set channel_id(id: string) {
        this.id = id;
    }

    /**
     * Sends a message to the specified channel.
     * 
     * @param {InteractionReplyData} data - The data for the message to be sent.
     * @returns {Promise<Message>} A Promise that resolves to the sent message.
     */
    async send(data: InteractionReplyData): Promise<Message> {
        let res = await this.interaction.iwr(
            `https://discord.com/api/v9/channels/${this.id}/messages`,
            "post",
            Interaction.parseMessage(data)
        );

        if (!res?.data)
            console.warn(
                `[TextChannel::send] HTTP 403 Forbidden -> POST /channels/${this.id}/messages`
            );
        if (!res) {
            console.warn("NO Response from TextChannel.send()");
            console.log({ data });
            return null;
        }

        return new Message(res.data, this.interaction);
    }
}