import axios, { AxiosError } from "axios";
import { SlashCommandBuilder, Cache, Command } from "..";

export async function registerCommands(
    commands: Cache<Command>,
    token: string,
    guildId?: string
) {
    let cmds = Array.from(commands, ([n, v]) => v).map((cmd) => {
        let builder: SlashCommandBuilder = cmd.data;
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
        throw error;
    }

    try {
        let uri = guildId ? `guilds/${guildId}/commands` : `commands`;
        await axios.put(
            `https://discord.com/api/v10/applications/${client.id}/${uri}`,
            cmds,
            { headers: { Authorization: `Bot ${token}` } }
        );
    } catch (error: any) {
        console.error(error);
        console.error(
            `HTTP ${error.response?.status} ${error.response?.statusText}`.red
        );
    }
}
