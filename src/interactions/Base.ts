import { Client } from "..";
import { Http } from "../Http";
import {
    AutoCompleteInteraction,
    AutoCompleteInteractionData,
} from "./AutoCompleteInteraction";
import { InteractionData } from "./BaseInteraction";
import { ButtonInteraction } from "./ButtonInteraction";
import { CommandInteraction } from "./CommandInteraction";
import { ModalInteraction } from "./ModalInteraction";
import { SelectMenuInteraction } from "./SelectMenuInteraction";

export type InteractionDataLike = InteractionData;

export class Base extends Http {
    data: InteractionDataLike | AutoCompleteInteractionData;
    constructor(data: InteractionDataLike | AutoCompleteInteractionData, client: Client) {
        super(client.token);
        this.data = data;
    }
    /**
     * Checks if the interaction is a command.
     * @returns {boolean} Returns true if the interaction is a command, otherwise false.
     */
    public isCommand(): this is CommandInteraction {
        return this.data.type == 2;
    }

    /**
     * Checks if the interaction is a button.
     * @returns {boolean} Returns true if the interaction is a button, otherwise false.
     */
    public isButton(): this is ButtonInteraction {
        return this.data.type == 3 && this.data.data.component_type == 2;
    }

    /**
     * Checks if the interaction is a modal submit.
     * @returns {boolean} Returns true if the interaction is a modal submit, otherwise false.
     */
    public isModalSubmit(): this is ModalInteraction {
        return this.data.type == 5;
    }

    public isAutoComplete(): this is AutoCompleteInteraction {
        return this.data.type == 4;
    }

    /**
     * Checks if the interaction is a select menu.
     * @returns {boolean} True if the interaction is a select menu, false otherwise.
     */
    public isSelectMenu(): this is SelectMenuInteraction {
        return (
            this.data.type == 3 &&
            [
                3 /* String */, 5 /* User */, 6 /* Role */, 7 /* Mentionable */,
                8 /* Channel */,
            ].includes(this.data.data.component_type)
        );
    }
}
