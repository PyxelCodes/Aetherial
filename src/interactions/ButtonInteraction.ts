import { FastifyReply } from "fastify";
import { Client, InteractionData, TextInput } from "..";
import { BaseComponentInteraction } from "./BaseComponentInteraction";

export class ButtonInteraction extends BaseComponentInteraction {
    data: InteractionData;

    constructor(data: InteractionData, res: FastifyReply, client: Client) {
        super(data, res, client);
        this.data = data;
    }

    /**
     * Displays a modal dialog for interaction.
     *
     * @param {TextInput} data - The text input data for the modal dialog.
     * @returns A promise that resolves when the modal dialog is closed.
     */
    async showModal(data: TextInput) {
        await this.iwr(
            `${this.url}/interactions/${this.data.id}/${this.data.token}/callback`,
            "post",
            {
                type: 0x9, //0x9 type -> APPLICATION_MODAL,
                data,
            }
        );
    }
}
