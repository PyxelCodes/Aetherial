import axios from "axios";
import { EventEmitter } from "events";
import { Message } from "./Message";
import { User } from "./User";
import { CacheManager } from "./core/CacheManager";
import { Cache } from "./core/Cache";
import { SlashCommandBuilder } from "./classes/SlashBuilder/SlashCommandBuilder";
import { REST } from "./rest/rest";
import nacl from "tweetnacl";
import {
    AutoCompleteInteraction,
    AutoCompleteInteractionData,
} from "./interactions/AutoCompleteInteraction";
import { CommandInteraction } from "./interactions/CommandInteraction";
import { ModalInteraction } from "./interactions/ModalInteraction";
import { SelectMenuInteraction } from "./interactions/SelectMenuInteraction";
import { InteractionData } from "./interactions/BaseInteraction";
import { ButtonInteraction } from "./interactions/ButtonInteraction";

type Interaction =
    | AutoCompleteInteraction
    | ButtonInteraction
    | CommandInteraction
    | ModalInteraction
    | SelectMenuInteraction;

//eslint-disable-next-line
export declare interface Client {
    on(event: "ready", listener: () => void): this;
    on(
        event: "interactionCreate",
        listener: (interaction: Interaction) => void
    ): this;
} //eslint-disable-next-line
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

            if ((req.body as ApiPing).type === 1) {
                return res.send({ type: 1 });
            }

            res.code(202); // this behaves sooo weird

            const iData = req.body as
                | InteractionData
                | AutoCompleteInteractionData;

            if (iData.type == 0x2)
                return this.emit(
                    "interactionCreate",
                    new CommandInteraction(iData, res, this)
                );
            if (iData.type == 0x3 && iData.data.component_type == 0x2)
                return this.emit(
                    "interactionCreate",
                    new ButtonInteraction(iData, res, this)
                );
            if (iData.type == 0x5)
                return this.emit(
                    "interactionCreate",
                    new ModalInteraction(iData, res, this)
                );
            if (iData.type == 0x4)
                return this.emit(
                    "interactionCreate",
                    new AutoCompleteInteraction(
                        iData as AutoCompleteInteractionData,
                        this
                    )
                );
            if (
                iData.type == 0x3 &&
                [3, 5, 6, 7, 8].includes(iData.data.component_type)
            )
                return this.emit(
                    "interactionCreate",
                    new SelectMenuInteraction(iData, res, this)
                );

            console.error("Unknown interaction type", iData.type);
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
        } catch {
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
    run(buttonRunData: IButtonInteraction): unknown;
}

interface IButtonInteraction {
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

interface ApiPing {
    type: 1;
}
