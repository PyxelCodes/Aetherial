export class OP_READY {
    public readonly op = 0;
    constructor(
        public data: { op: number; d: { guilds: { id: string }[] } },
        set: Set<string>
    ) {
        this.data = data;
        if (this.data.d.guilds) {
            for (let guild in this.data.d.guilds) {
                set.add(this.data.d.guilds[guild].id);
            }
        }
    }
}
