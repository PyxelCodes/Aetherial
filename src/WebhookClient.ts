import axios from 'axios';
import { Interaction, InteractionReplyData } from './Interaction';

export class WebhookClient {
    client: WebhookClient;
    id: string;
    token: string;

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

    async send(data: InteractionReplyData) {
        if (!this.token) throw new Error('NO_TOKEN_PROVIDED');

        if (data.ephemeral) data.flags = 64;

        try {
            await axios.post(
                `https://discord.com/api/webhooks/${this.id}/${this.token}`,
                Interaction.parseMessage(data)
            );
        } catch (e) {
            console.log(e);
        }
    }

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
