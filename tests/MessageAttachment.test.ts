import { MessageAttachment } from "../src";

describe("MessageAttachment", () => {
    it("should initialize with provided values", () => {
        const buffer = Buffer.from("sample data");
        const name = "attachment.txt";
        const attachment = new MessageAttachment(buffer, name);

        expect(attachment.attachment).toBe(buffer);
        expect(attachment.name).toBe(name);
        expect(attachment.filename).toBe(name);
    });

    it("should initialize with default name if not provided", () => {
        const buffer = Buffer.from("sample data");
        const attachment = new MessageAttachment(buffer);

        expect(attachment.name).toBeNull();
        expect(attachment.filename).toBeNull();
    });

    it("should parse the attachment to base64", () => {
        const buffer = Buffer.from("sample data");
        const attachment = new MessageAttachment(buffer);

        expect(attachment.parse()).toBe(buffer.toString("base64"));
    });

    it("should return the correct JSON representation", () => {
        const buffer = Buffer.from("sample data");
        const name = "attachment.txt";
        const attachment = new MessageAttachment(buffer, name);

        expect(attachment.toJSON()).toEqual({
            filename: name,
            id: 1,
        });
    });

    it("should handle parsing large buffers correctly", () => {
        const largeBuffer = Buffer.alloc(8 * 1024 * 1024, "a"); // 8 MiB buffer
        const attachment = new MessageAttachment(largeBuffer);

        expect(attachment.parse()).toBe(largeBuffer.toString("base64"));
    });
});
