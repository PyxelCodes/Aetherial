export class IntentBuilder {
    public intent: number = 0;

    constructor(intent?: number) {
        if (intent) this.intent = intent;
    }

    public addIntent(intent_id: ValidIntent) {
        let intent = validIntents.indexOf(intent_id);
        if (intent === -1) throw new Error(`Invalid intent: ${intent_id}`);
        this.intent |= 1 << intent;
        return this;
    }

    public toString() {
        return this.intent.toString();
    }

    public toNumber() {
        return this.intent;
    }

    public toJSON() {
        return { intent: this.intent };
    }
}

export const validIntents = [
    `GUILDS`,
    `GUILD_MEMBERS`,
    `GUILD_BANS`,
    `GUILD_EMOJIS_AND_STICKERS`,
    `GUILD_INTEGRATIONS`,
    `GUILD_WEBHOOKS`,
    `GUILD_INVITES`,
    `GUILD_VOICE_STATES`,
    `GUILD_PRESENCES`,
    `GUILD_MESSAGES`,
    `GUILD_MESSAGE_REACTIONS`,
    `GUILD_MESSAGE_TYPING`,
    `DIRECT_MESSAGES`,
    `DIRECT_MESSAGE_REACTIONS`,
    `DIRECT_MESSAGE_TYPING`,
    `MESSAGE_CONTENT`,
    `GUILD_SCHEDULED_EVENTS`,
];

export type ValidIntent =
    | `GUILDS`
    | `GUILD_MEMBERS`
    | `GUILD_BANS`
    | `GUILD_EMOJIS_AND_STICKERS`
    | `GUILD_INTEGRATIONS`
    | `GUILD_WEBHOOKS`
    | `GUILD_INVITES`
    | `GUILD_VOICE_STATES`
    | `GUILD_PRESENCES`
    | `GUILD_MESSAGES`
    | `GUILD_MESSAGE_REACTIONS`
    | `GUILD_MESSAGE_TYPING`
    | `DIRECT_MESSAGES`
    | `DIRECT_MESSAGE_REACTIONS`
    | `DIRECT_MESSAGE_TYPING`
    | `MESSAGE_CONTENT`
    | `GUILD_SCHEDULED_EVENTS`;
