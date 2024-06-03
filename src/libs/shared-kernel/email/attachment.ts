export class BufferAttachment {
    public readonly type = 'buffer';
    constructor(
        public readonly fileName: string,
        public readonly content: Buffer,
        public readonly contentType?: string,
    ) {}

    toObject() {
        return {
            filename: this.fileName,
            content: this.content,
            contentType: this.contentType,
        };
    }
}

export class PathAttachment {
    public readonly type = 'path';
    constructor(
        public readonly fileName: string,
        public readonly filename?: string,
        public readonly contentType?: string,
    ) {}

    toObject() {
        return {
            filename: this.fileName,
            path: this.filename,
            contentType: this.contentType,
        };
    }
}

export type Attachment = BufferAttachment | PathAttachment;
