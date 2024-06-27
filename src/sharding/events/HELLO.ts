export class OP_HELLO {
    public readonly op = 10;
    constructor(
        public data: { op: number; d: { heartbeat_interval: number } }
    ) {
        this.data = data;
    }

    heartbeatInterval() {
        return this.data.d.heartbeat_interval;
    }
}
