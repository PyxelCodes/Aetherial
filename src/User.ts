import { Client } from "./Client";
import { Http } from "./Http";
import { Interaction, InteractionReplyData } from "./Interaction";
import { User as CacheUser } from "./core/CacheManager";

/**
 * Represents a User.
 */
/**
 * Represents a user in the system.
 */
export class User {
    data: CacheUser;

    /**
     * Constructs a new instance of the User class.
     * @param data The data object containing user information.
     */
    constructor(data: CacheUser) {
        this.data = data;
    }

    /**
     * Gets the ID of the user.
     *
     * @returns The ID of the user.
     */
    public get id() {
        return this.data.id;
    }

    /**
     * Gets the username of the user.
     *
     * @returns The username of the user.
     */
    public get username() {
        return this.data.username;
    }

    /**
     * Gets the discriminator of the user.
     *
     * @returns The discriminator value.
     */
    public get discriminator() {
        return this.data.discriminator;
    }

    /**
     * Gets the avatar of the user.
     *
     * @returns The avatar of the user.
     */
    public get avatar() {
        return this.data.avatar;
    }

    /**
     * Gets the tag of the user.
     *
     * @returns The tag of the user.
     */
    public get tag() {
        return `${this.username}`;
    }

    /**
     * Gets the public flags of the user.
     *
     * @returns The public flags of the user.
     */
    public get public_flags() {
        return this.data.public_flags;
    }

    /**
     * Gets the display name of the user.
     *
     * @returns The display name of the user.
     */
    public get display_name() {
        return this.data.display_name;
    }

    /**
     * Gets the avatar decoration of the user.
     * @returns {string} The avatar decoration value.
     */
    public get avatar_decoration() {
        return this.data.avatar_decoration;
    }

    /**
     * Returns the URL of the user's avatar image.
     *
     * @returns The URL of the user's avatar image.
     */
    public displayAvatarURL() {
        return `https://cdn.discordapp.com/avatars/${this.data.id}/${this.data.avatar}.png`;
    }

    /**
     * Sends a message to a user.
     *
     * @async
     * @param userId - The ID of the user to send the message to.
     * @param message - The message to send.
     * @param client - The Discord client instance.
     * @returns {Promise<void>} A Promise that resolves to the sent message.
     */
    public static async send(
        userId: string,
        message: InteractionReplyData,
        client: Client
    ) {
        let http = new Http(client.token);
        await http
            .iwr(`https://discord.com/api/v9/users/@me/channels`, `post`, {
                recipient_id: userId,
            })
            .then(async (res) => {
                return await http.iwr(
                    `https://discord.com/api/v9/channels/${res.data.id}/messages`,
                    "post",
                    message
                );
            });
    }
}
