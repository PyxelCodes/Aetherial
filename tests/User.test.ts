import { User } from "../src";

describe("User", () => {
    const user = new User({
        tag: "test#0001",
        id: "1234567890",
        username: "test",
        discriminator: "0001",
        avatar: "avatar",
        public_flags: 0,
    });

    it("should return the correct ID", () => {
        expect(user.id).toBe("1234567890");
    });

    it("should return the correct username", () => {
        expect(user.username).toBe("test");
    });

    it("should return the correct discriminator", () => {
        expect(user.discriminator).toBe("0001");
    });

    it("should return the correct avatar", () => {
        expect(user.avatar).toBe("avatar");
    });

    it("should return the correct tag", () => {
        expect(user.tag).toBe("test");
    });

    it("should return the correct avatar URL", () => {
        expect(user.displayAvatarURL()).toBe("https://cdn.discordapp.com/avatars/1234567890/avatar.png");
    })
});
