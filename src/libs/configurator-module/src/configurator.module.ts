import { EmailModule } from '../../shared-kernel/email/email.module';
import { ConfiguratorController } from './controller/configurator.controller';
import { ConfiguratorEmailService } from './services/configurator-email.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [EmailModule],
    controllers: [ConfiguratorController],
    providers: [ConfiguratorEmailService],
    exports: [],
})
export class ConfiguratorModule {}
