import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplate } from './enums/email-template.enum';
import { join } from 'path';
import { SendEmailOptions } from './email/send-email-options';

@Injectable()
export class EmailService {
    constructor(private readonly _configService: AppConfigService, private readonly _mailerService: MailerService) {}

    /**
     * Отправка письма с заданным шаблоном.
     *
     * `tpl` должен содержать части пути в папке `tpl/`, соответствующий файлу без расширения,
     * например, `auth/confirm-email`.
     *
     * @param tpl
     * @param options
     */
    async sendViaTpl(tpl: EmailTemplate, options: SendEmailOptions) {
        // client
        const tplName = tpl.toString();
        await this._mailerService.sendMail({
            to: options.getToValue(),
            from: options.from.value,
            replyTo: options.replyTo?.value,
            subject: options.subject,
            // template: join(__dirname, `./tpl/${tplName}`),
            template: join(process.cwd(), `/src/libs/shared-kernel/email/tpl/${tplName}`),
            context: options.payload,
            attachments: options.attachments?.map((a) => a.toObject()),
        });
    }
}
