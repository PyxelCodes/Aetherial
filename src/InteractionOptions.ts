/* eslint-disable @typescript-eslint/no-explicit-any */
// im not gonna add types to this idc

import { Interaction } from './Interaction';

export class InteractionOptions {
    data: any;
    interaction: Interaction;
    constructor(data: any, interaction: Interaction) {
        this.data = data;
        this.interaction = interaction;
    }

    getString(name: string) {
        return (
            this.data.options?.find((x) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x) => x.name === name)?.value
        );
    }

    getInteger(name: string) {
        return (
            parseInt(this.data.options?.find((x) => x.name === name)?.value) ??
            parseInt(
                this.data.options?.[0]?.options?.find((x) => x.name === name)
                    ?.value
            )
        );
    }

    getNumber(name: string) {
        return (
            parseFloat(
                this.data.options?.find((x) => x.name === name)?.value
            ) ??
            parseFloat(
                this.data.options?.[0]?.options?.find((x) => x.name === name)
                    ?.value
            )
        );
    }

    getBoolean(name: string) {
        return (
            this.data.options?.find((x) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x) => x.name === name)?.value
        );
    }

    getSubcommand() {
        return (
            this.data.options?.find((x) => x.type === 1)?.name ??
            this.data.options?.[0]?.options?.find((x) => x.type === 1)?.name
        );
    }

    getChannel(name: string) {
        console.log(this.data.options[0].options);
        // supplies resolved channel!
        let id =
            this.data.options?.find((x) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x) => x.name === name)
                ?.value;
        if (!id) return null;
        return id;
    }

    getUser(name: string) {
        // supplies resolved user!
        let id =
            this.data.options?.find((x) => x.name === name)?.value ??
            this.data.options?.[0]?.options?.find((x) => x.name === name)
                ?.value;
        if (!id) return null;
        this.interaction.client.cache.addUser(this.data.resolved.users[id]);
        return this.data.resolved.users[id];
    }
}
