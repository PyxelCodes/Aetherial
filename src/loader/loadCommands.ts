import { readdirSync } from "fs";
import { join } from "path";
import { Cache, SlashCommandBuilder, Command } from "../";

export const loadCommands = (commands: Cache<Command>, asJSON = false) => {
    const root = join(require.main.filename, '..');
    // Reads commands directory and feed into collection
    readdirSync(join(root, "./commands")).forEach(async (dir) => {
        const commandArr = readdirSync(
            join(root, `./commands/${dir}`)
        ).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

        for (const file of commandArr) {
            let command = require(join(root, `./commands/${dir}/${file}`)); // eslint-disable-line @typescript-eslint/no-require-imports
            if(command.default) command = command.default;

            if (!command.name) continue;

            if (command.data) {
                command.data.setName(command.name);
                commands.set(command.name, command);
            } else {
                command.data = new SlashCommandBuilder().setName(command.name);
                commands.set(command.name, command);
            }
        }
    });

    if(asJSON) return Object.fromEntries(commands);
};
