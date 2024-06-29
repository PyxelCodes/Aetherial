import axios from 'axios';
import { EventEmitter } from 'events';
import { Message } from './Message';
import { User } from './User';
import { CacheManager } from './core/CacheManager';
import { Cache } from './core/Cache';
import { SlashCommandBuilder } from './classes/SlashBuilder/SlashCommandBuilder';
import { Interaction } from './Interaction';
import { REST } from './rest/rest';
import { verifyKeyMiddleware } from 'discord-interactions';

export class Client extends EventEmitter {
    commands: Cache<Command>;
    buttons: Cache<Button>;
    cache: CacheManager;
    ready: boolean;
    token: string;
    publicKey: string
    rest: REST;

    user: {
        id: string;
        avatar: string;
        username: string;
        displayAvatarURL(): string;
    };

    constructor(token: string, publicKey: string) {
        super();

        this.token = token;
        this.publicKey = publicKey;

        this.setMaxListeners(150);
        this.ready = true; // No EventEmitter is being used

        this.rest = new REST(this);

        // make neccessary calls
        axios
            .get(`https://discord.com/api/v9/users/@me`, {
                headers: { Authorization: `Bot ${this.token}` }
            })
            .then((res) => {
                this.user = res.data;
                this.user.displayAvatarURL = () =>
                    `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=1024`;

                this.rest.createServer().then(() => {
                    this.emit('ready');
                    this.interactionHandler();
                });
            })
            .catch((err) => {
                console.error(err);
                console.log(err?.response?.data);
            });

        this.commands = new Cache();
        this.buttons = new Cache();
        this.cache = new CacheManager();
    }

    private interactionHandler() {
        this.rest._app.post(
            '/interactions',
            verifyKeyMiddleware(this.publicKey),
            (req, res) => {
                this.emit('interactionCreate', new Interaction(req.body, res, this));
            }
        )
    }

    public async fetchUser(id: string) {
        let user: User;

        if (this.cache.users.has(id)) return new User(this.cache.users.get(id));

        try {
            user = await axios.get(`https://discord.com/api/v9/users/${id}`, {
                headers: { Authorization: `Bot ${this.token}` }
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

export interface Command {
    name: string;
    description: string;
    data?: SlashCommandBuilder;
    dev?: boolean;
    run(ICommandProps: ICommandArgument): unknown;
}

interface Button {
    name: string;
    isCommand: boolean;
    run(buttonRunData: ButtonInteraction): unknown;
}

interface ButtonInteraction {
    interaction: Interaction;
    data: string[];
}

export interface ICommandArgument {
    interaction: Interaction;
    client?: Bot;
    locale?: string;
    edit?: boolean;
    buttonData?: string[];
}