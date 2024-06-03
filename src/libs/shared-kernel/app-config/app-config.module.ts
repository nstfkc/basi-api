import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './validation-schema';
import appConfig from './config/app.config';
import emailConfig from './config/email.config';

@Global()
@Module({})
export class AppConfigModule {
    static forRoot(moduleEnvOverride) {
        return {
            module: AppConfigModule,
            imports: [
                ConfigModule.forRoot({
                    envFilePath: ['.env.development', moduleEnvOverride, '.env'],
                    load: [appConfig, emailConfig],
                    validationSchema,
                }),
            ],
            providers: [AppConfigService],
            exports: [AppConfigService],
        };
    }
}
