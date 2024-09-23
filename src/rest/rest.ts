import cors from "@fastify/cors";
import { Client } from "../";
import Fastify, { FastifyInstance } from "fastify";
import fastifyRawBody from "fastify-raw-body";
import fastifyExpress from "@fastify/express";

export class REST {
    public _app: FastifyInstance;
    public _client: Client;
    private _port: number = 3087;

    constructor(client: Client, portOverride?: number) {
        if (portOverride) this._port = portOverride;

        this._app = Fastify();

        this._app.register(cors, {});
        this._app.register(fastifyRawBody, { runFirst: true });

        this._client = client;
    }

    public async createServer() {
        await this._app.register(fastifyExpress);
        this._client.interactionHandler();
        return new Promise((resolve, reject) => {
            try {
                this._app.listen({ port: this._port, host: "0.0.0.0" }, () => {
                    resolve(this._port);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
