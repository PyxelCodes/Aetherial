import cors from "cors";
import express from "express";
import http from 'http';
import { Client } from '../';

export class REST {
    public _app: express.Application;
    public _client: Client;
    private _globalRouter: express.Router;
    private _port: number = 2555;

    constructor(client: Client, portOverride?: number) {
        if(portOverride) this._port = portOverride;

        this._app = express();
        this._globalRouter = express.Router();


        this._client = client;

        this._app.use(express.json({ limit: '10mb' }));
        this._globalRouter.use(express.urlencoded({ extended: false }))
        this._globalRouter.use(express.query({}));
        this._globalRouter.use(cors());

        this._app.use(this._globalRouter);
    }

    public async createServer() {
        return new Promise((resolve) => {
            http
                .createServer({}, this._app)
                .listen(this._port, () => resolve(0))
        })
    }
}