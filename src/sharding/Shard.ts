import "colors";
import { RawData, WebSocket } from "ws";
import { OP_GUILD_CREATE } from "./events/GUILD_CREATE";
import { OP_HELLO } from "./events/HELLO";
import { OP_IDENTIFY } from "./events/IDENTIFY";
import { OP_READY } from "./events/READY";
import { PresenceState } from "./classes/PresenceState";
import { IMember, OP_GUILD_MEMBER_CHUNK } from "./events/GUILD_MEMBER_CHUNK";
import { OP_PRESENCE_UPDATE } from "./events/PRESENCE_UPDATE";
import { EventEmitter } from "events";

export class Shard extends EventEmitter {
    private wss: WebSocket;
    private wssUrl = `wss://gateway.discord.gg/?v=10&encoding=json`;

    // connective stuff
    private heartbeatInterval: number = 40_000; // default 40s
    private lastACK: number = null;

    public guilds = new Map<string, Guild>();
    public presences = new Map<string, PresenceState>();

    private shard: [number, number];
    public shardId: number;
    public token: string;
    public intents: number;

    constructor() {
        super();
    }

    private message(data: RawData) {
        let o = this.parseOp(this.parse(data));

        if (o instanceof OP_GUILD_CREATE) {
        } else if (o instanceof OP_HELLO) {
            this.heartbeatInterval = o.heartbeatInterval();
            this.startHeartbeat();
            this.sendMessage(
                new OP_IDENTIFY()
                    .setToken(this.token)
                    .setIntents(this.intents)
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
                    case "GUILD_CREATE":
                        return new OP_GUILD_CREATE(data, this.guilds, this.presences);
                    case "READY":
                        new OP_READY(data, this.guilds);
                        this.emit("shardReady", this.shard);
                        if ((this.intents & 1 << 1) == 1 << 1) { // check for GUILD_MEMBERS intent
                            setTimeout(
                                (() => {
                                    // TODO this is horrible
                                    let guild_ids = Array.from(
                                        this.guilds.keys()
                                    );
                                    let interval = setInterval(() => {
                                        let next = guild_ids.shift();
                                        if (!next)
                                            return clearInterval(interval);
                                        //console.log(`Requesting guild members for ${next}`);
                                        this.requestGuildMembers(next);
                                    }, 250);
                                }).bind(this),
                                2500
                            );
                        }
                        break;

                    case "GUILD_MEMBER_CHUNK":
                        return new OP_GUILD_MEMBER_CHUNK(
                            data,
                            this.guilds,
                            this.presences,
                            this.hasPresenceIntent()
                        );
                    case "PRESENCE_UPDATE":
                        return new OP_PRESENCE_UPDATE(data, this.presences);
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }

    private requestGuildMembers(guildId: string) {
        this.sendMessage({
            op: 8,
            d: {
                guild_id: guildId,
                limit: 0,
                query: "",
                presences: this.hasPresenceIntent() ? true : false,
                nonce: "12",
            },
            s: null,
            t: null,
        });
    }

    private hasPresenceIntent() {
        return (this.intents & (1 << 8)) == 1 << 8;
    }

    private sendMessage(data: IDiscordGatewayOp) {
        this.wss.send(JSON.stringify(data));
    }

    private sendHeartbeat() {
        this.sendMessage({
            op: 1,
            d: this.lastACK, // [s] field
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

    public login(token: string) {
        this.token = token;
        this.wss = new WebSocket(this.wssUrl);

        this.wss.on("open", () => {
            this.emit("wssReady", null);
        });

        let shardId = parseInt(process.argv[2]);
        let shardCount = parseInt(process.argv[3]);
        let intents = parseInt(process.argv[4]);

        this.shard = [shardId, shardCount];
        this.shardId = shardId;
        this.intents = intents;

        this.wss.on("message", this.message.bind(this));
    }
}

interface IDiscordGatewayOp {
    op: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d: any;
    t?: string;
    s?: number;
}

export interface Guild {
    id: string;
    members: IMember[];
    presences: PresenceState[];
}
