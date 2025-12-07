import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { MlIntegrationService } from './ml-integration.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PropertiesController],
  providers: [PropertiesService, MlIntegrationService],
  exports: [PropertiesService, MlIntegrationService],
})
export class PropertiesModule {}