import { AxiosResponse } from 'axios';

export class IWRError extends Error {
    req: AxiosResponse;

    constructor(req: AxiosResponse) {
        super();
        this.name = 'IWRError';
        this.req = req;
    }

    public get message(): string {
        return `${this.req.status.toString().red} ${
            this.req.statusText
        }\nWebrequest to ${
            this.req.request.host.red
        } failed\n\n${JSON.stringify(this.req.data, null, 4)}`;
    }
}
