import { IntentBuilder } from '../src';
import { ValidIntent, validIntents } from '../src/classes/IntentBuilder';

describe('IntentBuilder', () => {
    it('should initialize with default or provided intent', () => {
        const defaultBuilder = new IntentBuilder();
        const customBuilder = new IntentBuilder(5); // Custom initial intent

        expect(defaultBuilder.toNumber()).toBe(0);
        expect(customBuilder.toNumber()).toBe(5);
    });

    it('should add valid intent correctly', () => {
        const builder = new IntentBuilder();
        const intent = 'GUILD_MESSAGES' as ValidIntent;

        builder.addIntent(intent);
        expect(builder.toNumber()).toBe(1 << validIntents.indexOf(intent));
    });

    it('should throw error for invalid intent', () => {
        const builder = new IntentBuilder();
        const invalidIntent = 'INVALID_INTENT' as ValidIntent;

        expect(() => builder.addIntent(invalidIntent)).toThrow(`Invalid intent: ${invalidIntent}`);
    });

    it('should return the correct string representation', () => {
        const builder = new IntentBuilder();
        builder.addIntent('GUILD_MESSAGES' as ValidIntent);
        
        expect(builder.toString()).toBe((1 << validIntents.indexOf('GUILD_MESSAGES')).toString());
    });

    it('should return the correct number representation', () => {
        const builder = new IntentBuilder();
        builder.addIntent('GUILD_MESSAGES' as ValidIntent);
        
        expect(builder.toNumber()).toBe(1 << validIntents.indexOf('GUILD_MESSAGES'));
    });

    it('should return the correct JSON representation', () => {
        const builder = new IntentBuilder();
        builder.addIntent('GUILD_MESSAGES' as ValidIntent);

        expect(builder.toJSON()).toEqual({ intent: 1 << validIntents.indexOf('GUILD_MESSAGES') });
    });

    it('should handle multiple intents', () => {
        const builder = new IntentBuilder();
        builder.addIntent('GUILD_MESSAGES' as ValidIntent);
        builder.addIntent('GUILD_VOICE_STATES' as ValidIntent);

        const guildMessagesBit = 1 << validIntents.indexOf('GUILD_MESSAGES');
        const guildVoiceStatesBit = 1 << validIntents.indexOf('GUILD_VOICE_STATES');

        expect(builder.toNumber()).toBe(guildMessagesBit | guildVoiceStatesBit);
    });
});
