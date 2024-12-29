import axios, { AxiosError } from "axios";
import { SlashCommandBuilder, Cache, Command } from "..";

export async function registerCommands(
    commands: Cache<Command>,
    token: string,
    guildId?: string
) {
    const cmds = Array.from(commands, ([n, v]) => v).map((cmd) => {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        let builder: SlashCommandBuilder = cmd.data;
        if (!builder) builder = new SlashCommandBuilder();
        builder.setName(cmd.name);
        if (!cmd.description)
            throw new Error(
                `[INVALID COMMAND FORMAT] Command ${cmd.name} is missing a description`
            );
        builder.setDescription(cmd.description);

        return builder.toJSON();
    });

    let client = null;

    try {
        client = (
            await axios.get(`https://discord.com/api/v10/users/@me`, {
                headers: { Authorization: `Bot ${token}` },
            })
        ).data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(`Failed to get client from Discord API`.red);
            console.log({
                url: error.config.url,
                response: error.response.data,
            });
            console.error(
                `HTTP ${error.response?.status} ${error.response?.statusText}`
                    .red
            );
        }
        return;
    }
    try {
        const uri = guildId ? `guilds/${guildId}/commands` : `commands`;
        await axios.put(
            `https://discord.com/api/v10/applications/${client.id}/${uri}`,
            cmds,
            { headers: { Authorization: `Bot ${token}` } }
        );
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(`Failed to send commands to Discord API`.red);
            console.log({
                url: error.config.url,
                response: error.response.data,
            });
            console.error(
                `HTTP ${error.response?.status} ${error.response?.statusText}`
                    .red
            );
        }
    }
}
