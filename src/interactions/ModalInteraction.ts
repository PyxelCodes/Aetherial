import { FastifyReply } from "fastify";
import { Client, InteractionData } from "..";
import { BaseInteraction } from "./BaseInteraction";

export class ModalInteraction extends BaseInteraction {
    constructor(data: InteractionData, res: FastifyReply, client: Client) {
        super(data, res, client);
    }
}