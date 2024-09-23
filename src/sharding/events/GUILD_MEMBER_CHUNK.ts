import { Guild } from "../Shard";
import { PresenceState } from "../classes/PresenceState";

export class OP_GUILD_MEMBER_CHUNK {
    public readonly op = 0;
    constructor(
        public data: { op: number; d: IGuildMemberChunk },
        guilds: Map<string, Guild>,
        presences: Map<string, PresenceState>,
        hasPresenceState: boolean
    ) {
        this.data = data;

        // push members to guild stack
        for (const member of data.d.members) {
            const ref = guilds.get(data.d.guild_id);

            if (ref) {
                const i = ref.members.findIndex(
                    (x) => x.user.id === member.user.id
                );
                if (i > -1) {
                    ref.members[i] = member;
                } else {
                    ref.members.push(member);
                }
            }
        }

        // push presences to presence stack
        if (hasPresenceState) {
            for (const presence of data.d.presences) {
                presences.set(presence.user.id, presence);
            }
        }
    }
}

interface IGuildMemberChunk {
    presences: PresenceState[];
    members: IMember[];
    guild_id: string;
    chunk_index: 0;
    chunk_count: 1;
}

export interface IMember {
    user: IGuildMember;
    roles: IRole[];
    premium_since?: number;
    pending: boolean;
    nick: string;
    mute: boolean;
    joined_at: string;
    flags: number;
    deaf: boolean;
    communication_disabled_until: number;
    banner: string;
    avatar: string;
}

interface IGuildMember {
    username: string;
    public_flags: number;
    id: string;
    global_name: string;
    display_name: string;
    discriminator: string;
    clan: string;
    bot: boolean;
    avatar_decoration_data: string;
    avatar: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IRole = any; // TODO: Implement role interface
