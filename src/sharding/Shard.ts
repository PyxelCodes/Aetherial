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
import { Client } from "..";
import { OP_INTERACTION_CREATE } from "./events/INTERACTION_CREATE";
import { log } from "../debug/logger";

export class Shard extends EventEmitter {
    public wss: WebSocket;
    private wssUrl = `wss://gateway.discord.gg`;
    private wssUrlOpt = "/?v=10&encoding=json";

    // connective stuff
    private heartbeatInterval: number = 40_000; // default 40s
    private lastACK: number = null;
    public httpLatency: number = 0;

    public guilds = new Map<string, Guild>();
    public presences = new Map<string, PresenceState>();

    private shard: [number, number];
    public shardId: number;
    public token: string;
    public intents: number;

    public client: Client;
    public user: { id: string; username: string }; //TODO real type

    // session
    private sessionURL: string = null;
    private sessionID: string = null;
    private shouldAuthenticate: boolean = true;

    private heartBeatTimer: ReturnType<typeof setInterval>;

    private ping_state_srv: number = 0;
    private ping_state_ACK: number = 0;

    constructor(publicKey?: string) {
        super();
        this.client = new Client(this.token, publicKey);
    }

    get ping() {
        return this.ping_state_ACK - this.ping_state_srv;
    }

    private async message(data: RawData) {
        log(
            "Shard::message => ",
            JSON.stringify(JSON.parse(data.toString()), null, 2)
        );
        const o = this.parseOp(this.parse(data));

        if (o instanceof OP_INTERACTION_CREATE) {
            this.emit("interactionCreate", o.interaction);
        } else if (o instanceof OP_HELLO) {
            if(this.heartBeatTimer) clearInterval(this.heartBeatTimer);
            this.heartbeatInterval = o.heartbeatInterval();
            this.heartBeatTimer = await this.startHeartbeat();
            if (!this.shouldAuthenticate) return;
            this.sendMessage(
                new OP_IDENTIFY()
                    .setToken(this.token)
                    .setIntents(this.intents)
                    .setShard(this.shard)
                    .op()
            );
            this.shouldAuthenticate = false;
        }
    }

    private applyListeners() {
        // run on every websocket reconnection
        this.wss.on("message", this.message.bind(this));
        this.wss.on("close", (code, reason) => {
            console.log(
                `Shard ${this.shardId} closed with code ${code ?? null}`
            );
            console.log(reason, "\n", "Buffer::resolve => ", reason.toString());

            if (code !== 1001) {
                // reconnect entirely
                this.fullReconnect();
            }
        });
    }

    private fullReconnect() {
        this.shouldAuthenticate = true;
        clearInterval(this.heartBeatTimer);
        this.wss.close(1001, Buffer.from("Shard.fullReconnect() called"));
        this.wss = new WebSocket(this.wssUrl + this.wssUrlOpt);

        console.log(`Reconnecting shard ${this.shardId} on ${this.wssUrl}`);

        this.applyListeners();
    }

    private parse(data: RawData): IDiscordGatewayOp {
        return JSON.parse(data.toString()); // maybe ETF or zlib-stream later
    }

    private resume() {
        this.shouldAuthenticate = false; // don't send another OP_IDENTIFY on OP_READY from remote
        this.wss.close(1001, Buffer.from("Shard.resume() called"));
        this.wss = new WebSocket(this.sessionURL);

        console.log(`Resuming shard ${this.shardId} on ${this.sessionURL}`);

        this.wss.on("open", () => {
            this.emit("websocketResume", void 0);

            setTimeout(() => {
                this.sendMessage({
                    op: 6,
                    d: {
                        token: this.token,
                        session_id: this.sessionID,
                        seq: this.lastACK,
                    },
                });
            }, 800);
        });

        this.applyListeners();
    }

    private parseOp(data: IDiscordGatewayOp) {
        if (data.s) this.lastACK = data.s;
        switch (data.op) {
            case 11: // HEARTBEAT ACK
                this.ping_state_ACK = Date.now();
                log(`Shard::parseOp => HEARTBEAT ACK ping acknowledged ${this.ping}ms`);
                break;
            case 10: // HELLO
                return new OP_HELLO(data);

            case 9: // Invalid Session
                this.fullReconnect();
                break;

            case 7:
                // Reconnect Event
                this.resume();

                break;

            case 0: {
                switch (data.t) {
                    case "GUILD_CREATE":
                        return new OP_GUILD_CREATE(
                            data,
                            this.guilds,
                            this.presences
                        );

                    case "READY":
                        new OP_READY(data, this.guilds);
                        this.sessionURL =
                            data.d.resume_gateway_url + this.wssUrlOpt;
                        this.sessionID = data.d.session_id;
                        this.user = data.d.user;
                        this.emit("shardReady", this.shard);
                        if ((this.intents & (1 << 1)) == 1 << 1) {
                            // check for GUILD_MEMBERS intent
                            setTimeout(
                                (() => {
                                    // TODO this is horrible
                                    const guild_ids = Array.from(
                                        this.guilds.keys()
                                    );
                                    const interval = setInterval(() => {
                                        const next = guild_ids.shift();
                                        if (!next)
                                            return clearInterval(interval);
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
                    case "INTERACTION_CREATE":
                        return new OP_INTERACTION_CREATE(data, this);
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
        log("Shard::sendMessage => ", JSON.stringify(data, null, 2));
        this.wss.send(JSON.stringify(data));
    }

    private sendHeartbeat() {
        this.ping_state_srv = Date.now();
        this.sendMessage({
            op: 1,
            d: this.lastACK, // [s] field
        });
    }

    private async startHeartbeat(): Promise<ReturnType<typeof setInterval>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.sendHeartbeat();
                resolve(
                    setInterval(() => {
                        this.sendHeartbeat();
                    }, this.heartbeatInterval)
                );
            }, Math.random() * this.heartbeatInterval);
        });
    }

    public login(token: string) {
        this.token = token;
        this.wss = new WebSocket(this.wssUrl + this.wssUrlOpt);

        this.wss.on("open", () => {
            this.emit("wssReady", null);
        });

        const shardId = parseInt(process.argv[2]);
        const shardCount = parseInt(process.argv[3]);
        const intents = parseInt(process.argv[4]);

        this.shard = [shardId, shardCount];
        this.shardId = shardId;
        this.intents = intents;

        this.applyListeners();
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
