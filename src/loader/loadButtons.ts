import { readdirSync } from "fs";
import { join } from "path";
import { Cache, SlashCommandBuilder, Command, Button } from "../";

export const loadButtons = (buttons: Cache<Button>, asJSON = false) => {
    let root = join(require.main.filename, "..");
    // Reads commands directory and feed into collection
    readdirSync(join(root, "./buttons"))
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .forEach(async (file) => {
            let button = require(join(root, `./buttons/${file}`));

            button.default ? (button = button.default) : button;

            buttons.set(button.name, button);
        });

    if (asJSON) return Object.fromEntries(buttons);
};
