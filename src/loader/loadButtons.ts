import { readdirSync } from "fs";
import { join } from "path";
import { Cache, Button } from "../";

export const loadButtons = (buttons: Cache<Button>, asJSON = false) => {
    const root = join(require.main.filename, "..");
    // Reads commands directory and feed into collection
    readdirSync(join(root, "./buttons"))
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .forEach(async (file) => {
            let button = require(join(root, `./buttons/${file}`)); // eslint-disable-line @typescript-eslint/no-require-imports
            if(button.default) button = button.default;

            buttons.set(button.name, button);
        });

    if (asJSON) return Object.fromEntries(buttons);
};
