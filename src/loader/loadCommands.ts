import { readdirSync } from "fs";
import { join } from "path";
import { Cache, SlashCommandBuilder, Command } from "../";

export const loadCommands = (commands: Cache<Command>, asJSON = false) => {
    let root = join(require.main.filename, '..');
    // Reads commands directory and feed into collection
    readdirSync(join(root, "./commands")).forEach(async (dir) => {
        const commandArr = readdirSync(
            join(root, `./commands/${dir}`)
        ).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

        for (let file of commandArr) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            let command = require(join(root, `./commands/${dir}/${file}`));
            command.default ? (command = command.default) : command;

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
