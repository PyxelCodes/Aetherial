import { BaseInteraction } from './interactions/BaseInteraction';

/**
 * Represents a class for handling interaction options.
 */
export class InteractionOptions {

    data: any; // eslint-disable-line
    interaction: BaseInteraction;

    /**
     * Constructs a new instance of the InteractionOptions class.
     * @constructor
     * @param data - The data for the InteractionOptions.
     * @param interaction - The interaction associated with the InteractionOptions.
     */
    constructor(data: any, interaction: BaseInteraction) { // eslint-disable-line
        this.data = data;
        this.interaction = interaction;
    }

    /**
     * Retrieves the string value associated with the given name.
     * If the name is found in the options array, the corresponding value is returned.
     * If the name is not found in the options array, the first value found in the nested options array is returned.
     * @param {string} name - The name of the string value to retrieve.
     * @returns {string} The string value associated with the given name, or undefined if the name is not found.
     */
    getString(name: string) {
        return (
            this.data.options?.find((x: { name: string; }) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x: { name: string; }) => x.name === name)?.value
        );
    }

    /**
     * Retrieves the integer value associated with the given name.
     * If the name is found in the options array, the corresponding value is returned.
     * If the name is not found in the options array, the first value found in the nested options array is returned.
     * @param {string} name - The name of the integer value to retrieve.
     * @returns {number} The integer value associated with the given name, or undefined if the name is not found.
     */
    getInteger(name: string) {
        return (
            parseInt(this.data.options?.find((x: { name: string; }) => x.name === name)?.value) ??
            parseInt(
                this.data.options?.[0]?.options?.find((x: { name: string; }) => x.name === name)
                    ?.value
            )
        );
    }

    /**
     * Retrieves the number value associated with the given name.
     * If the name is found in the options array, the corresponding value is returned.
     * If the name is not found in the options array, the first value found in the nested options array is returned.
     * @param {string} name - The name of the number value to retrieve.
     * @returns {number} The number value associated with the given name, or undefined if the name is not found.
     */
    getNumber(name: string) {
        return (
            parseFloat(
                this.data.options?.find((x: { name: string; }) => x.name === name)?.value
            ) ??
            parseFloat(
                this.data.options?.[0]?.options?.find((x: { name: string; }) => x.name === name)
                    ?.value
            )
        );
    }

    /**
     * Retrieves the boolean value associated with the given name.
     * If the name is found in the options array, the corresponding value is returned.
     * If the name is not found in the options array, the first value found in the nested options array is returned.
     * @param {string} name - The name of the boolean value to retrieve.
     * @returns {boolean} The boolean value associated with the given name, or undefined if the name is not found.
     */
    getBoolean(name: string) {
        return (
            this.data.options?.find((x: { name: string; }) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x: { name: string; }) => x.name === name)?.value
        );
    }

    /**
     * Retrieves the subcommand name associated with the interaction.
     * @returns {string} The subcommand name, or undefined if no subcommand is found.
     */
    getSubcommand() {
        return (
            this.data.options?.find((x: { type: number; }) => x.type === 1)?.name ??
            this.data.options?.[0]?.options?.find((x: { type: number; }) => x.type === 1)?.name
        );
    }


    /**
     * Retrieves the channel ID based on the provided name.
     * 
     * @param name - The name of the channel.
     * @returns The ID of the channel, or null if not found.
     */
    getChannel(name: string) {
        // supplies resolved channel!
        const id =
            this.data.options?.find((x: { name: string; }) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x: { name: string; }) => x.name === name)
                ?.value;
        if (!id) return null;
        return id;
    }

    /**
     * Retrieves the user associated with the given name.
     * @param {string} name - The name of the user to retrieve.
     * @returns {User} The user associated with the given name, or undefined if the user is not found.
     */
    /**
     * Retrieves a user based on their name.
     * 
     * @param name - The name of the user to retrieve.
     * @returns The resolved user object, or null if the user is not found.
     */
    getUser(name: string) {
        // supplies resolved user!
        const id =
            this.data.options?.find((x: { name: string; }) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x: { name: string; }) => x.name === name)
                ?.value;
        if (!id) return null;
        this.interaction.client.cache.addUser(this.data.resolved.users[id]);
        return this.data.resolved.users[id];
    }
}