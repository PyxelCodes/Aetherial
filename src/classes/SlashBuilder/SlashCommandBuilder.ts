/* eslint-disable @typescript-eslint/no-explicit-any */
export class SlashCommandBuilder {
    constructor() {}

    public readonly name: string;
    public readonly description: string;
    public readonly options: any[] = [];

    public setName(name: string) {
        Reflect.set(this, 'name', name);
        return this;
    }

    public setDescription(description: string) {
        Reflect.set(this, 'description', description);
        return this;
    }

    public addStringOption(input: inputFunction<StringBuilder>) {
        return this._sharedAddOptionMethod<StringBuilder>(
            input,
            new StringBuilder()
        );
    }
    public addUserOption(input: inputFunction<UserBuilder>) {
        return this._sharedAddOptionMethod<UserBuilder>(
            input,
            new UserBuilder()
        );
    }
    public addIntegerOption(input: inputFunction<IntegerBuilder>) {
        return this._sharedAddOptionMethod<IntegerBuilder>(
            input,
            new IntegerBuilder()
        );
    }
    public addBooleanOption(input: inputFunction<BooleanBuilder>) {
        return this._sharedAddOptionMethod<BooleanBuilder>(
            input,
            new BooleanBuilder()
        );
    }
    public addChannelOption(input: inputFunction<ChannelBuilder>) {
        return this._sharedAddOptionMethod<ChannelBuilder>(
            input,
            new ChannelBuilder()
        );
    }
    public addRoleOption(input: inputFunction<RoleBuilder>) {
        return this._sharedAddOptionMethod<RoleBuilder>(
            input,
            new RoleBuilder()
        );
    }

    public addSubcommand(input: inputFunction<SlashCommandBuilder>) {
        const { options } = this;

        const result =
            typeof input === 'function'
                ? input(new SlashCommandBuilder())
                : input;

        options.push({
            ...result.toJSON(),
            type: SlashCommandBuilderOptionType.SUB_COMMAND
        });
        return this;
    }

    private _sharedAddOptionMethod<T>(input: inputFunction<T>, Instance: T) {
        const { options } = this;
        const result = typeof input === 'function' ? input(Instance) : input;

        options.push(result);
        return this;
    }

    toJSON() {
        return { ...this };
    }
}

type inputFunction<T> = (input: T) => T;

class CommonBuilder {
    constructor() {}
    public required: boolean = false;
    public name: string;

    setDescription(description: string) {
        Reflect.set(this, 'description', description);
        return this;
    }

    setName(name: string) {
        Reflect.set(this, 'name', name);
        return this;
    }

    setRequired(required: boolean = true) {
        Reflect.set(this, 'required', required);
        return this;
    }

    toJSON() {
        return { ...this };
    }
}

export enum SlashCommandBuilderOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10
}

class RoleBuilder extends CommonBuilder {
    protected readonly type = SlashCommandBuilderOptionType.ROLE;
    public readonly role_types: any[] = [];
    public readonly autocomplete: boolean = false;
    constructor() {
        super();
    }

    addRoleType(roleType: any) {
        const { role_types } = this;
        role_types.push(roleType);
        return this;
    }

    toJSON() {
        return { ...this, ...super.toJSON() };
    }
}

class StringBuilder extends CommonBuilder {
    protected readonly type = SlashCommandBuilderOptionType.STRING;
    public readonly choices: any[] = [];
    constructor() {
        super();
    }

    addChoices(_choices: { name: string; value: string }[]) {
        const { choices } = this;
        choices.push(..._choices);
        return this;
    }

    addChoice(choice: { name: string; value: string }) {
        const { choices } = this;
        choices.push(choice);
        return this;
    }

    toJSON() {
        if (this.name === 'item') Reflect.set(this, 'autocomplete', true);
        return { ...this, ...super.toJSON() };
    }
}

class BooleanBuilder extends CommonBuilder {
    protected readonly type = SlashCommandBuilderOptionType.BOOLEAN;
    constructor() {
        super();
    }

    toJSON() {
        return { ...this, ...super.toJSON() };
    }
}

class ChannelBuilder extends CommonBuilder {
    protected readonly type = SlashCommandBuilderOptionType.CHANNEL;
    public readonly channel_types: any[] = [];
    constructor() {
        super();
    }

    addChannelType(channelType: any) {
        const { channel_types } = this;
        channel_types.push(channelType);
        return this;
    }

    toJSON() {
        return { ...this, ...super.toJSON() };
    }
}

class IntegerBuilder extends CommonBuilder {
    protected readonly type = SlashCommandBuilderOptionType.INTEGER;
    public readonly choices: any[] = [];
    public readonly min: number = -2147483648;
    public readonly max: number = 2147483647;
    constructor() {
        super();
    }

    setMin(min: number) {
        Reflect.set(this, 'min', min);
        return this;
    }

    setMax(max: number) {
        Reflect.set(this, 'max', max);
        return this;
    }

    toJSON() {
        return { ...this, ...super.toJSON() };
    }
}

class UserBuilder extends CommonBuilder {
    protected readonly type = SlashCommandBuilderOptionType.USER;
    constructor() {
        super();
    }

    toJSON() {
        return { ...this, ...super.toJSON() };
    }
}
