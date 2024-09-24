import { MessageButton } from '../src';

describe('MessageButton', () => {
    let button: MessageButton;

    beforeEach(() => {
        button = new MessageButton();
    });

    test('should set the label correctly', () => {
        button.setLabel('Click me');
        expect(button.label).toBe('Click me');
    });

    test('should set the emoji correctly when passed a single character emoji', () => {
        button.setEmoji('😊');
        expect(button.emoji).toEqual({ name: '😊', id: null });
    });

    test('should set the emoji correctly when passed an emoji string with name', () => {
        button.setEmoji(':emoji:');
        expect(button.emoji).toEqual({ name: 'emoji', id: null });
    });

    test('should set the emoji correctly when passed an emoji string with name and id', () => {
        button.setEmoji('<emoji:1234>');
        expect(button.emoji).toEqual({ name: 'emoji', id: '1234' });
    });

    test('should not set an emoji if passed an empty string', () => {
        button.setEmoji('');
        expect(button.emoji).toBeUndefined();
    });

    test('should set the URL correctly', () => {
        button.setUrl('https://example.com');
        expect(button.url).toBe('https://example.com');
    });

    test('should set style correctly with a number', () => {
        button.setStyle(3);
        expect(button.style).toBe(3);
    });

    test('should set style correctly when using string styles', () => {
        button.setStyle('PRIMARY');
        expect(button.style).toBe(1);

        button.setStyle('SECONDARY');
        expect(button.style).toBe(2);

        button.setStyle('SUCCESS');
        expect(button.style).toBe(3);

        button.setStyle('DANGER');
        expect(button.style).toBe(4);
    });

    test('should default style to PRIMARY if unknown style string is provided', () => {
        button.setStyle('UNKNOWN');
        expect(button.style).toBe(1);
    });

    test('should return correct JSON when URL is set (style should be 5)', () => {
        button.setLabel('Click me').setEmoji(':x:').setUrl('https://example.com');
        expect(button.toJSON()).toEqual({
            type: 2,
            style: 5,
            label: 'Click me',
            emoji: { name: 'x', id: null },
            url: 'https://example.com',
            disabled: false,
        });
    });

    test('should return correct JSON when URL is not set', () => {
        button.setLabel('Click me').setEmoji(':x:').setStyle('SUCCESS').setCustomId('button');
        expect(button.toJSON()).toEqual({
            type: 2,
            style: 3,
            label: 'Click me',
            emoji: { name: 'x', id: null },
            custom_id: 'button',
            url: undefined,
            disabled: false,
        });
    });
});
