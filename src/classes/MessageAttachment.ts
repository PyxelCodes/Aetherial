export class MessageAttachment {
    attachment: Buffer;
    name: string;
    filename: string;

    constructor(attachment: Buffer, name: string = null) {
        this.attachment = attachment;
        this.name = name;
        this.filename = name;
    }

    public parse() {
        return this.attachment.toString('base64'); // -> Buffer under 8MiB
    }

    public toJSON() {
        return {
            filename: this.filename,
            id: 1
        };
    }
}
