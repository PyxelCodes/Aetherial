import { TextInput } from '../src';

describe('TextInput', () => {
    it('should initialize and chain methods correctly', () => {
        const textInput = new TextInput()
            .setLabel('Test Label')
            .setPlaceholder('Test Placeholder')
            .setRequired(true)
            .setTitle('Test Title');

        expect(textInput.label).toBe('Test Label');
        expect(textInput.placeholder).toBe('Test Placeholder');
        expect(textInput.required).toBe(true);
        expect(textInput.title).toBe('Test Title');
    });

    it('should set required to false by default', () => {
        const textInput = new TextInput()
            .setLabel('Test Label')
            .setPlaceholder('Test Placeholder')
            .setTitle('Test Title');

        expect(textInput.required).toBe(false);
    });

    it('should handle JSON output correctly', () => {
        const textInput = new TextInput()
            .setLabel('Test Label')
            .setPlaceholder('Test Placeholder')
            .setRequired(true)
            .setTitle('Test Title');

        expect(textInput.toJSON()).toEqual({
            title: 'Test Title',
            custom_id: textInput.custom_id,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: textInput.custom_id,
                            label: 'Test Label',
                            style: 1,
                            min_length: 1,
                            max_length: 200,
                            placeholder: 'Test Placeholder',
                            required: true
                        }
                    ]
                }
            ]
        });
    });
});
