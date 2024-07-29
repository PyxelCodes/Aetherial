import { Guild } from "../Shard";

export class OP_READY {
    public readonly op = 0;
    constructor(
        public data: { op: number; d: { guilds: Guild[] } },
        set: Map<string, Guild>
    ) {
        this.data = data;
        if (this.data.d.guilds) {
            for (let guild in this.data.d.guilds) {
                set.set(this.data.d.guilds[guild].id, this.data.d.guilds[guild]);
            }
        }
    }
}
