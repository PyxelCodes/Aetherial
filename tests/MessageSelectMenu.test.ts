import { MessageSelectMenu } from "../src"; // Adjust the path as necessary
import { MessageSelectMenuOptions } from "../src/classes/MessageSelectMenu";

describe("MessageSelectMenu", () => {
    it("should initialize with default values", () => {
        const menu = new MessageSelectMenu();
        expect(menu.toJSON()).toEqual({
            type: 3,
            options: [],
            placeholder: undefined,
            custom_id: null,
            disabled: false,
            min_values: undefined,
            max_values: undefined,
        });
    });

    it("should set and get options", () => {
        const menu = new MessageSelectMenu();
        const options: MessageSelectMenuOptions[] = [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2", description: "A second option" },
        ];
        menu.setOptions(options);
        expect(menu.toJSON().options).toEqual([
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2", description: "A second option" },
        ]);
    });

    it("should format options correctly", () => {
        const menu = new MessageSelectMenu();
        const option: MessageSelectMenuOptions = {
            label: "Option with Emoji",
            value: "emoji",
            emoji: "<:emoji:1234>",
        };
        const formattedOption = menu.formatOption(option);
        expect(formattedOption.emoji).toEqual({
            name: "emoji",
            id: "1234",
        });
    });

    it("should set and get placeholder", () => {
        const menu = new MessageSelectMenu();
        menu.setPlaceholder("Select an option");
        expect(menu.toJSON().placeholder).toBe("Select an option");
    });

    it("should add options correctly", () => {
        const menu = new MessageSelectMenu();
        const option1: MessageSelectMenuOptions = {
            label: "Option 1",
            value: "1",
        };
        const option2: MessageSelectMenuOptions = {
            label: "Option 2",
            value: "2",
        };
        menu.addOptions(option1, option2);
        expect(menu.toJSON().options).toEqual([option1, option2]);
    });

    it("should add a single option correctly", () => {
        const menu = new MessageSelectMenu();
        const option: MessageSelectMenuOptions = {
            label: "Single Option",
            value: "1",
        };
        menu.addOption(option);
        expect(menu.toJSON().options).toEqual([option]);
    });

    it("should set minimum values correctly", () => {
        const menu = new MessageSelectMenu();
        menu.setMinValues(1);
        expect(menu.toJSON().min_values).toBe(1);
    });

    it("should set maximum values correctly", () => {
        const menu = new MessageSelectMenu();
        menu.setMaxValues(3);
        expect(menu.toJSON().max_values).toBe(3);
    });

    it("should set minimum and maximum values correctly", () => {
        const menu = new MessageSelectMenu();
        menu.setMinMax(1, 5);
        expect(menu.toJSON().min_values).toBe(1);
        expect(menu.toJSON().max_values).toBe(5);
    });

    it("should handle emoji formatting without id", () => {
        const menu = new MessageSelectMenu();
        const option: MessageSelectMenuOptions = {
            label: "Option with Emoji",
            value: "emoji",
            emoji: "😀",
        };
        const formattedOption = menu.formatOption(option);
        expect(formattedOption.emoji).toEqual({ name: "😀", id: null });
    });
});
