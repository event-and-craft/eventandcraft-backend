import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { FileStorageService } from '../storage/storage.service';

@Injectable()
export class GcsStorageService implements FileStorageService {
  private readonly logger = new Logger(GcsStorageService.name);
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage();
    this.bucketName = this.configService.get<string>('GCS_PRODUCTION_BUCKET')!;
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
  ): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const uniqueFileName = `${Date.now()}-${originalName}`;
      const file = bucket.file(uniqueFileName);

      await file.save(fileBuffer, {
        metadata: {
          contentType: mimetype,
        },
      });

      return `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
    } catch (error) {
      this.logger.error(`Error uploading file to GCS`, error);
      throw new InternalServerErrorException('Could not upload file');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const fileNameMatch = fileUrl.split(`${this.bucketName}/`);
      if (fileNameMatch.length < 2) {
        throw new Error('Invalid file URL format');
      }

      const uniqueFileName = fileNameMatch[1];
      const file = bucket.file(uniqueFileName);

      await file.delete();
    } catch (error) {
      this.logger.error(`Error deleting file from GCS: ${fileUrl}`, error);
      throw new InternalServerErrorException('Could not delete file');
    }
  }

  async getSignedUrl(fileName: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);

      const [url] = await file.getSignedUrl({
        action: 'write', // The document says client PUTs directly to signed URL
        contentType: 'application/octet-stream', // Generic or as specified
        expires: Date.now() + 15 * 60 * 1000,
      });

      return url;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${fileName}`, error);
      throw new InternalServerErrorException('Could not generate signed URL');
    }
  }
}
