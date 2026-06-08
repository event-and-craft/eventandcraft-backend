import { Module, Global } from '@nestjs/common';
import { GcsModule } from '../gcs/gcs.module';
import { GcsStorageService } from '../gcs/gcs-storage.service';
import { FileStorageService } from './storage.service';

@Global()
@Module({
  imports: [GcsModule],
  providers: [
    {
      provide: FileStorageService,
      useExisting: GcsStorageService,
    },
  ],
  exports: [FileStorageService],
})
export class StorageModule {}
