import 'colors';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { RawData, WebSocket } from 'ws';
import { OP_GUILD_CREATE } from './events/GUILD_CREATE';
import { OP_HELLO } from './events/HELLO';
import { OP_IDENTIFY } from './events/IDENTIFY';
import { OP_READY } from './events/READY';

export class Shard {
    private wss: WebSocket;
    private wssUrl = `wss://gateway.discord.gg/?v=10&encoding=json`;

    // connective stuff
    private heartbeatInterval: number = 40_000; // default 40s
    private lastACK: number = null;

    private guilds = new Set<string>();
    private shard: [number, number];
    public token: string;

    constructor(shardId: number, shardCount: number, token: string) {
        this.token = token;
        this.wss = new WebSocket(this.wssUrl);

        this.wss.on('open', () => {
            /* TODO */
        });

        this.shard = [shardId, shardCount];

        this.wss.on('message', this.message.bind(this));
    }

    private message(data: RawData) {
        let o = this.parseOp(this.parse(data));

        if (o instanceof OP_GUILD_CREATE) {
            this.guilds.add(o.data.d.id);
        } else if (o instanceof OP_HELLO) {
            this.heartbeatInterval = o.heartbeatInterval();
            this.startHeartbeat();
            this.sendMessage(
                new OP_IDENTIFY()
                    .setToken(this.token)
                    .setIntents(1 << 0)
                    .setShard(this.shard)
                    .op()
            );
        }
    }

    private parse(data: RawData): IDiscordGatewayOp {
        return JSON.parse(data.toString()); // maybe ETF or zlib-stream later
    }

    private parseOp(data: IDiscordGatewayOp) {
        if (data.s) this.lastACK = data.s;
        switch (data.op) {
            case 10: // HELLO
                return new OP_HELLO(data);
            case 0: {
                switch (data.t) {
                    case 'GUILD_CREATE':
                        return new OP_GUILD_CREATE(data);
                    case 'READY':
                        return new OP_READY(data, this.guilds);
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }

    private sendMessage(data: IDiscordGatewayOp) {
        this.wss.send(JSON.stringify(data));
    }

    private sendHeartbeat() {
        this.sendMessage({
            op: 1,
            d: this.lastACK // [s] field
        });
    }

    private startHeartbeat() {
        setTimeout(() => {
            this.sendHeartbeat();
            setInterval(() => {
                this.sendHeartbeat();
            }, this.heartbeatInterval);
        }, Math.random() * this.heartbeatInterval);
    }
}

interface IDiscordGatewayOp {
    op: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d: any;
    t?: string;
    s?: number;
}

// SHARD INIT

new Shard(parseInt(process.argv[2]), parseInt(process.argv[3]), process.argv[4]);
