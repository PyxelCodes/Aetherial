import { Cache } from '../src';

describe('Cache', () => {
    it('should initialize with data correctly', () => {
        const data: [string, number][] = [['key1', 1], ['key2', 2]];
        const cache = new Cache<number>(data);

        expect(cache.get('key1')).toBe(1);
        expect(cache.get('key2')).toBe(2);
    });

    it('should find an item using the find method', () => {
        const cache = new Cache<number>([['key1', 1], ['key2', 2], ['key3', 3]]);

        const result = cache.find((value, key) => value > 1);
        expect(result).toBe(2);
    });

    it('should return undefined if no item matches the find condition', () => {
        const cache = new Cache<number>([['key1', 1], ['key2', 2], ['key3', 3]]);

        const result = cache.find((value, key) => value > 5);
        expect(result).toBeUndefined();
    });

    it('should handle an empty cache correctly', () => {
        const cache = new Cache<number>();

        const result = cache.find((value, key) => value > 1);
        expect(result).toBeUndefined();
    });
});
