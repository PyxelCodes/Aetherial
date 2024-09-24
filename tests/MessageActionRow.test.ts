import {
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    TextInput,
} from "../src";

describe("MessageActionRow", () => {
    it("should initialize with default values", () => {
        const actionRow = new MessageActionRow();
        expect(actionRow.toJSON()).toEqual({
            type: 1,
            components: [],
        });
    });

    it("should add a single component", () => {
        const actionRow = new MessageActionRow<MessageButton>();
        const button = new MessageButton(); // Adjust initialization if needed
        actionRow.addComponent(button);
        expect(actionRow.toJSON().components).toEqual([button.toJSON()]);
    });

    it("should add multiple components", () => {
        const actionRow = new MessageActionRow();
        const button = new MessageButton(); // Adjust initialization if needed
        const selectMenu = new MessageSelectMenu(); // Adjust initialization if needed
        actionRow.addComponents([button, selectMenu]);
        expect(actionRow.toJSON().components).toEqual([
            button.toJSON(),
            selectMenu.toJSON(),
        ]);
    });

    it("should handle adding components as an array", () => {
        const actionRow = new MessageActionRow();
        const button = new MessageButton(); // Adjust initialization if needed
        const selectMenu = new MessageSelectMenu(); // Adjust initialization if needed
        actionRow.addComponents([button, selectMenu]);
        expect(actionRow.toJSON().components).toEqual([
            button.toJSON(),
            selectMenu.toJSON(),
        ]);
    });

    it("should handle mixed types of components", () => {
        const actionRow = new MessageActionRow();
        const button = new MessageButton(); // Adjust initialization if needed
        const selectMenu = new MessageSelectMenu(); // Adjust initialization if needed
        const textInput = new TextInput(); // Adjust initialization if needed
        actionRow.addComponents([button, selectMenu, textInput]);
        expect(actionRow.toJSON().components).toEqual([
            button.toJSON(),
            selectMenu.toJSON(),
            textInput.toJSON(),
        ]);
    });

    it("should parse components to JSON format", () => {
        const actionRow = new MessageActionRow();
        const button = new MessageButton(); // Adjust initialization if needed
        const selectMenu = new MessageSelectMenu(); // Adjust initialization if needed

        actionRow.addComponents([button, selectMenu]);
        expect(actionRow.toJSON()).toEqual({
            type: 1,
            components: [
                button.toJSON(),
                selectMenu.toJSON(),
            ],
        });
    });

    it("should handle components that are already in JSON format", () => {
        const actionRow = new MessageActionRow();
        const jsonComponent = { type: 2, custom_id: "json_button_id" };
        actionRow.addComponent(jsonComponent as any);
        expect(actionRow.toJSON().components).toEqual([jsonComponent]);
    });
});
