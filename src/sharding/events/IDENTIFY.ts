export class OP_IDENTIFY {
    data: IIDENTIFY = {} as IIDENTIFY;
    constructor() {
        this.data.op = 2;
        this.data.d = {
            token: null,
            intents: null,
            shard: null,
            properties: {
                $os: 'linux',
                $browser: 'aetherial',
                $device: 'aetherial'
            }
        };
    }

    setToken(token: string) {
        this.data.d.token = token;
        return this;
    }

    setIntents(intents: number) {
        this.data.d.intents = intents;
        return this;
    }

    setShard(shard: [number, number]) {
        this.data.d.shard = shard;
        return this;
    }

    op() {
        return this.data;
    }
}

interface IIDENTIFY {
    op: 2;
    d: {
        token: string;
        intents: number;
        shard?: [number, number];
        properties: {
            $os: string;
            $browser: string;
            $device: string;
        };
    };
}
