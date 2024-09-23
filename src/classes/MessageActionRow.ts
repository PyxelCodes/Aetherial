import { MessageButton } from './MessageButton';
import { MessageSelectMenu } from './MessageSelectMenu';
import { TextInput } from './Modal';

export type MessageComponent = MessageButton | MessageSelectMenu | TextInput;

type MessageComponentResolvable<T> = T | MessageComponent;

export class MessageActionRow<T extends MessageComponent = undefined> {
    type: number = 1;
    components: (T | MessageComponent)[];

    constructor() {
        this.components = [];
    }

    public addComponent(component: T | MessageComponent) {
        this.components.push(component);
        return this;
    }

    public addComponents(
        components:
            | MessageComponentResolvable<T>[]
            | MessageComponentResolvable<T>
    ) {
        // Make sure Component is @@iterable
        if (!Array.isArray(components)) components = [components];
        this.components.push(...components);
        return this;
    }

    private parseComponents() {
        const parsed = [];

        for (const component of this.components) {
            try {
                parsed.push(component.toJSON());
            } catch {
                // already JSON parsed (-> ButtonCollector.timeout)
                parsed.push(component);
            }
        }

        return parsed;
    }

    public toJSON() {
        return {
            type: this.type,
            components: this.parseComponents()
        };
    }
}

export declare interface MessageComponentData {
    type: 1;
    components: [];
}
