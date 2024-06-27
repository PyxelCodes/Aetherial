export class OP_GUILD_CREATE {
    public readonly op = 0;
    constructor(public data: { op: number; d: { id: string } }) {
        this.data = data;
    }
}
