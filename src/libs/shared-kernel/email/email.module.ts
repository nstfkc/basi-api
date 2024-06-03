import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AppConfigService } from '../app-config/app-config.service';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

function ifCond(v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return v1 == v2 ? options.fn(this) : options.inverse(this);
        case '===':
            return v1 === v2 ? options.fn(this) : options.inverse(this);
        case '!=':
            return v1 != v2 ? options.fn(this) : options.inverse(this);
        case '!==':
            return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case '<':
            return v1 < v2 ? options.fn(this) : options.inverse(this);
        case '<=':
            return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case '>':
            return v1 > v2 ? options.fn(this) : options.inverse(this);
        case '>=':
            return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case '&&':
            return v1 && v2 ? options.fn(this) : options.inverse(this);
        case '||':
            return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
}

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config) => {
                return {
                    transport: {
                        host: config.email.host,
                        secure: false,
                        port: config.email.port,
                        auth: {
                            user: config.email.user,
                            pass: config.email.password,
                        },
                    },
                    defaults: {
                        from: config.email.defaultFrom,
                    },
                    template: {
                        dir: join(process.cwd(), `/src/libs/shared-kernel/email/tpl`),
                        adapter: new HandlebarsAdapter({ ifCond: ifCond }),
                        options: {
                            strict: true,
                        },
                    },
                } as MailerOptions;
            },
            inject: [AppConfigService],
        }),
    ],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
