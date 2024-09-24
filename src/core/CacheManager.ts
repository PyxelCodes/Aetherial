import { MessageData } from '../Message';
import { Cache } from './Cache';

export class CacheManager {
    users: Cache<User>;
    guilds: Cache<Guild>;
    messages: Cache<MessageData>;

    constructor() {
        this.users = new Cache();
        this.guilds = new Cache();
        this.messages = new Cache();
    }

    public addUser(user: User) {
        if (!user.tag) user.tag = `${user.username}`;
        this.users.set(user.id, user);
    }

    public addGuild(guild: Guild) {
        this.guilds.set(guild.id, guild);
    }

    public addGuildMember(member: GuildMember) {
        if (member.user) {
            this.users.set(member.user.id, member.user);
        } else { // @ts-expect-error - Types are not accurate
            this.users.set(member.id, member);
        }
    }
}

export interface User {
    id: string;
    tag: string;
    username: string;
    discriminator: string;
    display_name?: string;
    avatar: string;
    avatar_decoration?: string;
    public_flags: number;
}
export interface Guild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
    permissions_new: string;
}
export interface GuildMember {
    id: string;
    user: User;
    nick: string;
    avatar: string;
    roles: string[];
    joined_at: string;
    premium_since: string;
    deaf: boolean;
    mute: boolean;
    pending: boolean;
    permissions: string;
}
