export class MessageEmbed {
    data: MessageEmbedData;

    constructor(embedData?: MessageEmbedData) {
        this.data = {
            type: 'rich',
            fields: [],
            description: ''
        };
        if (embedData) this.data = { ...embedData };
    }

    get author() {
        return this.data.author;
    }

    public setInternalFlag(flag: string) {
        this.data.type = flag;
        return this;
    }

    get fields() {
        return this.data.fields;
    }

    get hexColor() {
        return this.data.color;
    }

    set description(str: string) {
        this.data.description = str;
    }

    public setAuthor(obj: { name: string; iconURL?: string }) {
        this.data.author = {
            name: obj.name,
            icon_url: obj.iconURL
        };
        return this;
    }

    public addField(name: string, value: string, inline: boolean = false) {
        this.data.fields.push({
            name,
            value,
            inline
        });
        return this;
    }

    public setFields(
        fields: { name: string; value: string; inline: boolean }[]
    ) {
        this.data.fields = fields;
        return this;
    }

    public setTitle(title: string) {
        this.data.title = title;
        return this;
    }

    public setDescription(description: string) {
        this.data.description = description;
        return this;
    }

    public setURL(url: string) {
        this.data.url = url;
        return this;
    }

    public setTimestamp(timestamp: number) {
        this.data.timestamp = new Date(timestamp).toISOString();
        return this;
    }

    public setColor(color: number | string) {
        if (typeof color == 'string') {
            color = parseInt(color.replace('#', ''), 16);
        }

        this.data.color = color;
        return this;
    }

    public setFooter(obj: { text: string; iconURL?: string }) {
        this.data.footer = {
            text: obj.text,
            icon_url: obj.iconURL
        };
        return this;
    }

    public setImage(url: string) {
        this.data.image = {
            url
        };
        return this;
    }

    public setThumbnail(url: string) {
        this.data.thumbnail = {
            url
        };
        return this;
    }

    public setVideo(url: string) {
        this.data.video = {
            url
        };
        return this;
    }

    public setProvider(name: string, url: string) {
        this.data.provider = {
            name,
            url
        };
        return this;
    }

    public toJSON() {
        return this.data;
    }
}

export declare interface MessageEmbedData {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {
        text?: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    image?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    thumbnail?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    video?: {
        url?: string;
        height?: number;
        width?: number;
    };
    provider?: {
        name?: string;
        url?: string;
    };
    author?: {
        name?: string;
        url?: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
}
