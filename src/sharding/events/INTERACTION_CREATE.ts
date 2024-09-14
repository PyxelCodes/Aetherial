import { Shard } from "../Shard";
import { ShardInteraction } from "../ShardInteraction";
import { IMember } from "./GUILD_MEMBER_CHUNK";

export class OP_INTERACTION_CREATE {
    public readonly op = 0;
    interaction: ShardInteraction;
    constructor(public data: { d: InteractionCreateData }, shard: Shard) {
        this.data = data;
        this.interaction = new ShardInteraction(data.d, shard);
    }
}

export interface InteractionCreateData {
    version: number;
    type: number;
    token: string;
    member: IMember;
    locale: string;
    id: string;
    guild_locale: string;
    guild_id: string;
    guild: { locale: string; id: string; features: any[] };
    entitlements: any[]; // idk what these are
    entitlement_sku_ids: any[];
    data: {
        type: number;
        name: string;
        id: string;
        guild_id: string;
    };
    context: number;
    channel_id: string;
    channel: TextChannel;
    authorizing_integration_owners: { [index: string]: string };
    application_id: string;
    app_permissions: number;
}

interface TextChannel {
    type: number;
    topic: string;
    theme_color: string;
    rate_limit_per_user: number;
    position: number;
    permissions: string;
    parent_id: string;
    nsfw: boolean;
    name: string;
    last_message_id: string;
    id: string;
    icon_emoji: any;
    guild_id: string;
    flags: number;
}
