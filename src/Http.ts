import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { Client, Interaction, InteractionReplyData, Shard } from ".";
import sizeOf from "buffer-image-size";
import FormData from "form-data";

export class Http {
    public url = `https://discord.com/api/v10`;
    private token: string;
    constructor(token: string) {
        this.token = token;
    }

    /**
     * Sends an HTTP request to the specified URL using Axios.
     *
     * @param {string} url - The URL to send the request to.
     * @param {Client | Shard} client - The client object used for authorization.
     * @param {string} type - The type of HTTP request (e.g., "get", "post").
     * @param body - The request body (optional).
     * @returns {Promise<AxiosResponse<any, any>>} A Promise that resolves to the AxiosResponse object.
     */
    async iwr(url: string, type?: string, body?: any, queryString?: any) {
        let req: AxiosResponse<any>;

        try {
            // IWebRequest to Discord API (Axios)

            req = await axios({
                method: type || "get",
                url,
                headers: { Authorization: `Bot ${this.token}` },
                params: queryString ?? {},
                data: body ?? null, // Include body only if it's not null
            });
        } catch (error: any) {
            // Handle Specific Errors
            if (error instanceof AxiosError) {
                console.error(
                    `[Http::iwr] Request failed with Code ${error.response.status}`,
                    JSON.stringify(error?.response?.data)
                );
                throw error;
            } else {
                throw error;
            }
        }

        return req;
    }

    /**
     * Sends a form data request with interaction reply data to the specified URL.
     *
     * @param {InteractionReplyData} body - The interaction reply data.
     * @param {string} url - The URL to send the request to.
     * @param {boolean} alreadyReplied - Optional parameter indicating if the reply has already been sent. Default is false.
     * @returns A promise that resolves to the response from the server.
     */
    async iwrFiles(
        body: InteractionReplyData,
        url: string,
        alreadyReplied = false
    ) {
        // @ts-ignore
        let form = this.createFormDataFileBody({ data: body, type: 4 });
        try {
            // if (alreadyReplied) {
            //     await axios({
            //         method: "patch",
            //         url,
            //         data: { attachments: [] },
            //         headers: {
            //             Authorization: `Bot ${this.token}`,
            //         },
            //     });
            // }
            let res = await axios({
                method: alreadyReplied ? "patch" : "post",
                url,
                data: form,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
                    Authorization: `Bot ${this.token}`,
                },
                params: { with_response: true },
            });

            return res;
        } catch (error) {
            if (error instanceof Error) console.log(error);
            if (error instanceof AxiosError) {
                if (error.response?.data)
                    console.log(JSON.stringify(error.response.data, null, 2));
                if (!error.response?.data?.message) console.error(error);
                console.info(
                    `Request URL: ${
                        url.replace(
                            /\/webhooks\/\d+\/[a-zA-Z0-9_-]+/g,
                            "/webhooks/<token>"
                        ).magenta
                    }`
                );
            }
        }
    }

    private createFormDataFileBody(data: {
        data: InteractionReplyData;
        type: number;
    }) {
        let body = data.data;
        let form = new FormData();
        let j = 0;
        body.attachments = [];

        for (let i in body.files) {
            let size = sizeOf(body.files[i].attachment);
            body.attachments.push({
                name: body.files[i].name,
                id: j,
                size: Buffer.byteLength(body.files[i].attachment),
                content_type: `image/png`,
                height: size.height,
                width: size.width,
            } as any);
            j++;
        }

        form.append("payload_json", JSON.stringify({ type: 0x4, data: body }));
        console.log(body);
        let isIterable = (obj: any) =>
            obj != null && typeof obj[Symbol.iterator] === "function";

        if (!isIterable(body.files)) body.files = [];

        let i = 0;
        for (let file of body.files) {
            console.log(`files[${i}]`, file.attachment, {
                filename: file.name.replace("\r\n", "").replace("\n", ""),
                contentType: `image/png`,
            });
            form.append(`files[${i}]`, file.attachment, {
                filename: file.name.replace("\r\n", "").replace("\n", ""),
                contentType: `image/png`,
            });
            i++;
        }

        return form;
    }

    static addInstanceRequestInterceptor(instance: any) {
        instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                config.headers["request-startTime"] = process.hrtime();
                return config;
            }
        );
        instance.interceptors.response.use((response: AxiosResponse) => {
            const start = response.config.headers["request-startTime"];
            const end = process.hrtime(start);
            const milliseconds = Math.round(end[0] * 1000 + end[1] / 1e6);
            response.headers["X-Response-Time"] = milliseconds;
            return response;
        });
    }
}
