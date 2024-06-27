export class Cache<CacheType> extends Map<string, CacheType> {
    constructor(data?: [string, CacheType][]) {
        super(data);
    }

    public find(
        callback: (
            value: CacheType,
            key: string,
            map: Map<string, CacheType>
        ) => boolean
    ): CacheType | undefined {
        // @ts-ignore
        return Array.from(this.values()).find(callback);
    }
}
