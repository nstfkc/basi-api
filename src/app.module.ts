import { Module } from '@nestjs/common';
import { AppConfigModule } from './libs/shared-kernel/app-config/app-config.module';
import { ConfiguratorModule } from './libs/configurator-module/src/configurator.module';

@Module({
    imports: [AppConfigModule.forRoot('.env'), ConfiguratorModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
