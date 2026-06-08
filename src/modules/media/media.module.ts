import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bullmq';
import { Media } from './models/media.model';
import { MediaVariant } from './models/media-variant.model';
import { MediaJob } from './models/media-job.model';
import { SecurityScanResult } from './models/security-scan-result.model';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaProcessor } from './workers/media.processor';

@Module({
  imports: [
    SequelizeModule.forFeature([Media, MediaVariant, MediaJob, SecurityScanResult]),
    BullModule.registerQueue({
      name: 'media_processing',
    }),
  ],
  providers: [MediaService, MediaProcessor],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
