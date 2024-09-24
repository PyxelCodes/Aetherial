import axios from 'axios';
import { BaseInteraction, InteractionReplyData } from './interactions/BaseInteraction';

/**
 * Represents a WebhookClient used for sending data to a Discord webhook.
 */
export class WebhookClient {
    client: WebhookClient;
    id: string;
    token: string;

    /**
     * Constructs a new WebhookClient.
     * 
     * @param {object} data - The data object containing the properties for the WebhookClient.
     * @param {string} data.id - The ID of the webhook.
     * @param {string} data.token - The token of the webhook.
     * @param {string} [data.url] - The URL of the webhook.
     * 
     * @throws {Error} Throws an error if the provided URL is invalid.
     */
    constructor(data) {
        Reflect.set(this, 'client', this);

        let { id, token } = data;

        if ('url' in data) {
            const parsed = this.parseWebhookURL(data.url);

            if (!parsed) throw new Error('INVALID_WEBHOOK_URL');

            ({ id, token } = parsed);

            this.id = id;
            Reflect.set(this, 'token', token);
        }
    }

    /**
     * Sends the provided data as an interaction reply.
     * @param data - The data to be sent as the interaction reply.
     * @throws {Error} - Throws an error if no token is provided.
     */
    async send(data: InteractionReplyData) {
        if (!this.token) throw new Error('NO_TOKEN_PROVIDED');

        if (data.ephemeral) data.flags = 64;

        try {
            await axios.post(
                `https://discord.com/api/webhooks/${this.id}/${this.token}`,
                BaseInteraction.parseMessage(data)
            );
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Parses a webhook URL and extracts the webhook ID and token.
     * 
     * @param url - The webhook URL to parse.
     * @returns An object containing the webhook ID and token, or null if the URL is invalid.
     */
    private parseWebhookURL(url: string) {
        const matches = url.match(
            /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i
        );

        if (!matches || matches.length <= 2) return null;

        const [, id, token] = matches;
        return {
            id,
            token
        };
    }
}
