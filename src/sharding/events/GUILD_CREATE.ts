import { Guild } from "../Shard";
import { PresenceState } from "../classes/PresenceState";

export class OP_GUILD_CREATE {
    public readonly op = 0;
    constructor(public data: { op: number; d: Guild }, guilds: Map<string, Guild>, presences: Map<string, PresenceState>) {
        this.data = data;

        guilds.set(this.data.d.id, this.data.d);

        if(this.data.d.presences) {
            for(let presence of this.data.d.presences) {
                // @ts-ignore
                presences.set(presence.user.id, presence);
            }
        }

        // @ts-ignore
    }
}
