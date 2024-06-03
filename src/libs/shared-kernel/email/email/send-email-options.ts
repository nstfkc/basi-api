import { Email } from '../email';
import { Attachment } from '../attachment';

export class SendEmailOptions {
    constructor(
        public readonly to: Email | Email[],
        public readonly from: Email,
        public readonly subject: string,
        public readonly payload = {},
        public readonly attachments?: Attachment[],
        public readonly replyTo?: Email,
    ) {
        if (to instanceof Email) {
            if (to.eq(from)) {
                // throw new Error('email receiver can not be the same as email sender');
            }
        } else {
            if (to.find((e) => e.eq(from))) {
                throw new Error('email sender can not be in the receivers list');
            }
        }
    }

    getToValue() {
        return this.to instanceof Email ? this.to.value : this.to.map((e) => e.value);
    }
}
