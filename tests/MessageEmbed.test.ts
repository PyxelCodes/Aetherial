import { MessageEmbed } from "../src";

describe("MessageEmbed", () => {
    it("should initialize with default values", () => {
        const embed = new MessageEmbed();
        expect(embed.toJSON()).toEqual({
            type: "rich",
            fields: [],
            description: "",
        });
    });

    it("should set and get the author", () => {
        const embed = new MessageEmbed();
        embed.setAuthor({
            name: "Author",
            iconURL: "http://example.com/icon.png",
        });
        expect(embed.author).toEqual({
            name: "Author",
            icon_url: "http://example.com/icon.png",
        });
    });

    it("should set and get the description", () => {
        const embed = new MessageEmbed();
        embed.setDescription("This is a description.");
        expect(embed.toJSON().description).toBe("This is a description.");
    });

    it("should add fields correctly", () => {
        const embed = new MessageEmbed();
        embed.addField("Field 1", "Value 1");
        embed.addField("Field 2", "Value 2", true);
        expect(embed.fields).toEqual([
            { name: "Field 1", value: "Value 1", inline: false },
            { name: "Field 2", value: "Value 2", inline: true },
        ]);
    });

    it("should set and get the color", () => {
        const embed = new MessageEmbed();
        embed.setColor("#ff0000");
        expect(embed.hexColor).toBe(0xff0000);
    });

    it("should set and get the footer", () => {
        const embed = new MessageEmbed();
        embed.setFooter({
            text: "Footer text",
            iconURL: "http://example.com/footer-icon.png",
        });
        expect(embed.toJSON().footer).toEqual({
            text: "Footer text",
            icon_url: "http://example.com/footer-icon.png",
        });
    });

    it("should set and get the image", () => {
        const embed = new MessageEmbed();
        embed.setImage("http://example.com/image.png");
        expect(embed.toJSON().image).toEqual({
            url: "http://example.com/image.png",
        });
    });

    it("should set and get the thumbnail", () => {
        const embed = new MessageEmbed();
        embed.setThumbnail("http://example.com/thumbnail.png");
        expect(embed.toJSON().thumbnail).toEqual({
            url: "http://example.com/thumbnail.png",
        });
    });

    it("should set and get the video", () => {
        const embed = new MessageEmbed();
        embed.setVideo("http://example.com/video.mp4");
        expect(embed.toJSON().video).toEqual({
            url: "http://example.com/video.mp4",
        });
    });

    it("should set and get the provider", () => {
        const embed = new MessageEmbed();
        embed.setProvider("Provider Name", "http://example.com/provider");
        expect(embed.toJSON().provider).toEqual({
            name: "Provider Name",
            url: "http://example.com/provider",
        });
    });

    it("should set and get the title", () => {
        const embed = new MessageEmbed();
        embed.setTitle("Title");
        expect(embed.toJSON().title).toBe("Title");
    });

    it("should set and get the URL", () => {
        const embed = new MessageEmbed();
        embed.setURL("http://example.com");
        expect(embed.toJSON().url).toBe("http://example.com");
    });

    it("should set and get the timestamp", () => {
        const timestamp = Date.now();
        const embed = new MessageEmbed();
        embed.setTimestamp(timestamp);
        expect(embed.toJSON().timestamp).toBe(
            new Date(timestamp).toISOString()
        );
    });

    it("should set internal flag", () => {
        const embed = new MessageEmbed();
        embed.setInternalFlag("custom");
        expect(embed.toJSON().type).toBe("custom");
    });
});
