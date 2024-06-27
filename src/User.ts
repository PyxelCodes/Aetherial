import { Client } from './Client';
import { Interaction, InteractionReplyData } from './Interaction';
import { User as CacheUser } from './core/CacheManager';

export class User {
    data: CacheUser;

    constructor(data: CacheUser) {
        this.data = data;
    }

    public get id() {
        return this.data.id;
    }
    public get username() {
        return this.data.username;
    }
    public get discriminator() {
        return this.data.discriminator;
    }
    public get avatar() {
        return this.data.avatar;
    }
    public get tag() {
        return `${this.username}`;
    }
    public get public_flags() {
        return this.data.public_flags;
    }
    public get display_name() {
        return this.data.display_name;
    }
    public get avatar_decoration() {
        return this.data.avatar_decoration;
    }

    public displayAvatarURL() {
        return `https://cdn.discordapp.com/avatars/${this.data.id}/${this.data.avatar}.png`;
    }

    public static async send(userId: string, message: InteractionReplyData, client: Client) {
        await Interaction.iwr(
            `https://discord.com/api/v9/users/@me/channels`,
            client,
            `post`,
            { recipient_id: userId }
        ).then(async (res) => {
            return await Interaction.iwr(
                `https://discord.com/api/v9/channels/${res.data.id}/messages`,
                client,
                'post',
                message
            );
        });
    }
}
