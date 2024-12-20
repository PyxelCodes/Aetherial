import axios, {
    AxiosError,
    AxiosResponse,
} from "axios";
import {
    InteractionReplyData,
    MessageAttachment,
} from ".";
import sizeOf from "buffer-image-size";
import FormData from "form-data";

/**
*
* The class used to interact with tht Discord API.
*
*/
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
        * @param {string} [type] - The type of HTTP request (e.g., "get", "post").
        * @param {any} [body] - The request body (optional).
        * @param {any} [queryString] - The query string parameters (optional).
        * @returns {Promise<AxiosResponse<any, any>>} A Promise that resolves to the AxiosResponse object.
        * @throws {AxiosError} Throws an error if the request fails.
        */
    async iwr(
        url: string,
        type?: string,
        body?: any, // eslint-disable-line
        queryString?: any // eslint-disable-line
    ) {
        let req: AxiosResponse<any>; // eslint-disable-line

        try {
            // IWebRequest to Discord API (Axios)

            req = await axios({
                method: type || "get",
                url,
                headers: { Authorization: `Bot ${this.token}` },
                params: queryString ?? {},
                data: body ?? null, // Include body only if it's not null
            });
        } catch (error) {
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
       * @param {boolean} [alreadyReplied=false] - Optional parameter indicating if the reply has already been sent. Default is false.
       * @returns {Promise<AxiosResponse<any, any>>} A promise that resolves to the response from the server.
       * @throws {AxiosError} Throws an error if the request fails.
       */
    async iwrFiles(
        body: InteractionReplyData,
        url: string,
        alreadyReplied = false
    ) {
        const form = this.createFormDataFileBody({ data: body, type: 4 }, alreadyReplied);
        try {
            const res = await axios({
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
                    `Request URL: ${url.replace(
                        /\/webhooks\/\d+\/[a-zA-Z0-9_-]+/g,
                        "/webhooks/<token>"
                    ).magenta
                    }`
                );
            }
        }
    }
    /**
        * Creates a FormData object with the specified interaction reply data and type.
        *
        * @param {Object} data - The data object containing interaction reply data and type.
        * @param {InteractionReplyData} data.data - The interaction reply data.
        * @param {number} data.type - The type of interaction.
        * @param {boolean} [isPATCH=false] - Optional parameter indicating if the request is a PATCH request. Default is false.
        * @returns {FormData} The FormData object containing the interaction reply data.
        */
    private createFormDataFileBody(data: {
        data: InteractionReplyData;
        type: number;
    }, isPATCH = false) {
        const body = data.data;
        const form = new FormData();
        let j = 0;
        body.attachments = [];

        for (const i in body.files) {
            const size = sizeOf(body.files[i].attachment);
            body.attachments.push({
                name: body.files[i].name,
                id: j,
                size: Buffer.byteLength(body.files[i].attachment),
                content_type: `image/png`,
                height: size.height,
                width: size.width,
            } as any); // eslint-disable-line
            j++;
        }

        form.append("payload_json", JSON.stringify(isPATCH ? body : { type: 0x4, data: body }));
        const isIterable = (obj: ArrayLike<MessageAttachment>) =>
            obj != null && typeof obj[Symbol.iterator] === "function";

        if (!isIterable(body.files)) body.files = [];

        let i = 0;
        for (const file of body.files) {
            form.append(`files[${i}]`, file.attachment, {
                filename: file.name.replace("\r\n", "").replace("\n", ""),
                contentType: `image/png`,
            });
            i++;
        }

        return form;
    }
}
