import { SlashCommandBuilder, SlashCommandBuilderOptionType, StringBuilder, UserBuilder, IntegerBuilder, BooleanBuilder, ChannelBuilder, RoleBuilder } from '../src/classes/SlashBuilder/SlashCommandBuilder';

describe('SlashCommandBuilder', () => {
    it('should initialize and chain methods correctly', () => {
        const builder = new SlashCommandBuilder()
            .setName('testCommand')
            .setDescription('Test command description');

        expect(builder.name).toBe('testCommand');
        expect(builder.description).toBe('Test command description');
    });

    it('should add string option correctly', () => {
        const builder = new SlashCommandBuilder()
            .addStringOption(option => option.setName('testString').setDescription('Test string option'));

        expect(builder.options).toHaveLength(1);
        expect(builder.options[0]).toEqual({
            type: SlashCommandBuilderOptionType.STRING,
            name: 'testString',
            choices: [],
            description: 'Test string option',
            required: false,
        });
    });

    it('should add user option correctly', () => {
        const builder = new SlashCommandBuilder()
            .addUserOption(option => option.setName('testUser').setDescription('Test user option'));

        expect(builder.options).toHaveLength(1);
        expect(builder.options[0]).toEqual({
            type: SlashCommandBuilderOptionType.USER,
            name: 'testUser',
            description: 'Test user option',
            required: false,
        });
    });

    it('should add subcommands correctly', () => {
        const builder = new SlashCommandBuilder()
            .addSubcommand(subcommand => subcommand
                .setName('subcommandName')
                .setDescription('Subcommand description')
                .addStringOption(option => option.setName('subOption').setDescription('Subcommand string option')));

        expect(builder.options).toHaveLength(1);
        expect(builder.options[0]).toEqual({
            type: SlashCommandBuilderOptionType.SUB_COMMAND,
            name: 'subcommandName',
            description: 'Subcommand description',
            options: [
                {
                    type: SlashCommandBuilderOptionType.STRING,
                    name: 'subOption',
                    choices: [],
                    required: false,
                    description: 'Subcommand string option'
                }
            ]
        });
    });

    it('should handle JSON output correctly', () => {
        const builder = new SlashCommandBuilder()
            .setName('command')
            .setDescription('Command description')
            .addIntegerOption(option => option.setName('numberOption').setDescription('Number option').setMin(1).setMax(100));

        expect(builder.toJSON()).toEqual({
            name: 'command',
            description: 'Command description',
            options: [
                {
                    type: SlashCommandBuilderOptionType.INTEGER,
                    name: 'numberOption',
                    description: 'Number option',
                    required: false,
                    choices: [],
                    min: 1,
                    max: 100
                }
            ]
        });
    });

    it('should handle option builders correctly', () => {
        const stringBuilder = new StringBuilder().setName('stringOption').setDescription('String option').addChoice({ name: 'choice1', value: 'value1' });
        const integerBuilder = new IntegerBuilder().setName('intOption').setDescription('Integer option').setMin(0).setMax(10);

        expect(stringBuilder.toJSON()).toEqual({
            type: SlashCommandBuilderOptionType.STRING,
            name: 'stringOption',
            description: 'String option',
            required: false,
            choices: [{ name: 'choice1', value: 'value1' }]
        });
        expect(integerBuilder.toJSON()).toEqual({
            type: SlashCommandBuilderOptionType.INTEGER,
            name: 'intOption',
            required: false,
            choices: [],
            description: 'Integer option',
            min: 0,
            max: 10
        });
    });
});
