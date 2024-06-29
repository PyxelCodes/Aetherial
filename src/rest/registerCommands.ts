import axios, { AxiosError } from "axios";
import { SlashCommandBuilder, Cache, Command } from "..";

export async function registerCommands(
    commands: Cache<Command>,
    token: string
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
        await axios.put(
            `https://discord.com/api/v10/applications/${client.id}/guilds/1256598531662151680/commands`,
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
