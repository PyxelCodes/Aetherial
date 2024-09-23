import axios from "axios";
import { EventEmitter } from "events";
import { Message } from "./Message";
import { User } from "./User";
import { CacheManager } from "./core/CacheManager";
import { Cache } from "./core/Cache";
import { SlashCommandBuilder } from "./classes/SlashBuilder/SlashCommandBuilder";
import { Interaction, InteractionData } from "./Interaction";
import { REST } from "./rest/rest";
import nacl from "tweetnacl";

export declare interface Client {
    on(event: "ready", listener: () => void): this;
    on(
        event: "interactionCreate",
        listener: (interaction: Interaction) => void
    ): this;
}
export class Client extends EventEmitter {
    commands: Cache<Command>;
    buttons: Cache<Button>;
    cache: CacheManager;
    ready: boolean;
    token: string;
    publicKey: string;
    rest: REST;
    httpLatency: number = 0;

    user: {
        id: string;
        avatar: string;
        username: string;
        displayAvatarURL(): string;
    };

    constructor(token: string, publicKey?: string, port?: number) {
        super();

        this.token = token;
        this.publicKey = publicKey;

        this.setMaxListeners(150);
        this.ready = true; // No EventEmitter is being used

        if (publicKey) {
            this.rest = new REST(this, port ?? 3087);

            // make neccessary calls
            axios
                .get(`https://discord.com/api/v10/users/@me`, {
                    headers: { Authorization: `Bot ${this.token}` },
                })
                .then((res) => {
                    this.user = res.data;
                    this.user.displayAvatarURL = () =>
                        `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=1024`;

                    this.rest.createServer().then(() => {
                        this.emit("ready");
                    });
                })
                .catch((err) => {
                    console.error(err);
                    console.log(err?.response?.data);
                });
        }

        this.commands = new Cache();
        this.buttons = new Cache();
        this.cache = new CacheManager();
    }

    public interactionHandler() {
        this.rest._app.post("/interactions", async (req, res) => {
            // Setup handling
            const sig = req.headers["x-signature-ed25519"] as string;
            const timestamp = req.headers["x-signature-timestamp"] as string;
            const body = req.rawBody;
            const isVerified = nacl.sign.detached.verify(
                Buffer.from(timestamp + body),
                Buffer.from(sig, "hex"),
                Buffer.from(this.publicKey, "hex")
            );

            if (!isVerified)
                return res.status(401).send("Invalid request signature");

            if ((req.body as any)?.type === 1) {
                console.log("Received PING");
                return res.send({ type: 1 });
            }

            let interaction = new Interaction(
                req.body as InteractionData,
                res,
                this
            );
            res.code(202) // this behaves sooo weird
            this.emit("interactionCreate", interaction);
        });
    }

    public async fetchUser(id: string) {
        let user: User;

        if (this.cache.users.has(id)) return new User(this.cache.users.get(id));

        try {
            user = await axios.get(`https://discord.com/api/v9/users/${id}`, {
                headers: { Authorization: `Bot ${this.token}` },
            });
        } catch (error) {
            console.error(
                `Error in Client.fetchUser(${id}) -> ${error}\n [DEBUG] -> UserCache -> Map<${this.cache.users.size}>`
            );
            return null;
        }

        this.cache.users.set(id, user.data);

        return new User(user.data);
    }

    public async fetchMessage(channelID: string, messageID: string, client) {
        let message;
        try {
            message = await axios.get(
                `https://discord.com/api/v9/channels/${channelID}/messages/${messageID}`,
                { headers: { Authorization: `Bot ${this.token}` } }
            );
        } catch (error) {
            return null;
        }

        this.cache.messages.set(messageID, message.data);

        return new Message(message.data, client.interaction);
    }
}

interface Bot extends Client {
    commands: Cache<Command>;
    buttons: Cache<Button>;
}

export interface Command<T = Interaction> {
    name: string;
    description: string;
    data?: SlashCommandBuilder;
    dev?: boolean;
    run(ICommandProps: ICommandArgument<T>): unknown;
}

export interface Button {
    name: string;
    isCommand: boolean;
    run(buttonRunData: ButtonInteraction): unknown;
}

interface ButtonInteraction {
    interaction: Interaction;
    data: string[];
}

export interface ICommandArgument<T = Interaction> {
    interaction: T | Interaction;
    client?: Bot;
    locale?: string;
    edit?: boolean;
    buttonData?: string[];
}
