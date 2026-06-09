import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import gcsConfig from '../../config/gcs.config';
import { GcsStorageService } from './gcs-storage.service';

@Module({
  imports: [ConfigModule.forFeature(gcsConfig)],
  providers: [GcsStorageService],
  exports: [GcsStorageService],
})
export class GcsModule {}
