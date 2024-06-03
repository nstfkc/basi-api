import { Email } from '../email';
import { Attachment } from '../attachment';
import { SendEmailOptions } from './send-email-options';

type EmailOptions = {
    to?: Email | Email[];
    from?: Email;
    subject?: string;
    payload?: Record<string, any>;
    attachments?: Attachment[];
    replyTo?: Email;
};

export class SendEmailOptionsBuilder {
    public to?: Email | Email[];
    public from?: Email;
    public subject?: string;
    public payload?: Record<string, any> = {};
    public attachments?: Attachment[];
    public replyTo?: Email;

    constructor(options?: EmailOptions) {
        if (options) {
            this.fromOptions(options);
        }
    }

    addOptions(options?: EmailOptions) {
        this.fromOptions(options);
        return this;
    }

    setTo(to: Email | Email[]): this {
        this.to = to;
        return this;
    }
    setFrom(from: Email): this {
        this.from = from;
        return this;
    }
    setReplyTo(replyTo: Email): this {
        this.replyTo = replyTo;
        return this;
    }
    setSubject(subject: string): this {
        this.subject = subject;
        return this;
    }
    setPayload(payload: Record<string, unknown>): this {
        this.payload = payload;
        return this;
    }
    setAttachments(attachments: Attachment[]): this {
        this.attachments = attachments;
        return this;
    }

    build(): SendEmailOptions {
        return new SendEmailOptions(this.to, this.from, this.subject, this.payload, this.attachments, this.replyTo);
    }

    buildWith(options: EmailOptions): SendEmailOptions {
        this.addOptions(options);
        return this.build();
    }

    buildNewWith(options: EmailOptions): SendEmailOptions {
        return this.clone().addOptions(options).build();
    }

    clone(): SendEmailOptionsBuilder {
        return new SendEmailOptionsBuilder()
            .setTo(this.to)
            .setFrom(this.from)
            .setReplyTo(this.replyTo)
            .setSubject(this.subject)
            .setPayload(this.payload)
            .setAttachments(this.attachments);
    }

    private fromOptions(options: EmailOptions) {
        for (const property in options) {
            if (options[property]) {
                const setterName = `set${property.charAt(0).toUpperCase() + property.slice(1)}`;
                this[setterName](options[property]);
            }
        }
    }
}
