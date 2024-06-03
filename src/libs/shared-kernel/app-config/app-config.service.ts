import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import emailConfig from './config/email.config';

/**
 * @see /src/infrastructure/app-config/validation-schema.ts for some rules
 */
@Injectable()
export class AppConfigService {
    constructor(
        @Inject(appConfig.KEY)
        public readonly app: ConfigType<typeof appConfig>,
        @Inject(emailConfig.KEY)
        public readonly email: ConfigType<typeof emailConfig>,
    ) {}
}
