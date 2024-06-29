import cors from "@fastify/cors";
import { Client } from "../";
import Fastify, { FastifyInstance } from "fastify";
import fastifyRawBody from "fastify-raw-body";
import fastifyExpress from "@fastify/express";
import { verifyKeyMiddleware } from "discord-interactions";

export class REST {
    public _app: FastifyInstance;
    public _client: Client;
    private _port: number = 2555;

    constructor(client: Client, portOverride?: number) {
        if (portOverride) this._port = portOverride;

        this._app = Fastify();

        this._app.register(cors, {});
        this._app.register(fastifyRawBody, { runFirst: true });

        this._client = client;
    }

    public async createServer() {
        await this._app.register(fastifyExpress);
        this._app.express.use(verifyKeyMiddleware(this._client.publicKey));
        this._client.interactionHandler();
        return new Promise((resolve, reject) => {
            this._app.listen({ port: this._port }, () => {
                resolve(this._port);
            });
        });
    }
}
