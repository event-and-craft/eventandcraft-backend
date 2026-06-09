import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import { FileStorageService } from '../storage/storage.service';

@Injectable()
export class GcsStorageService implements FileStorageService {
  private readonly logger = new Logger(GcsStorageService.name);
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const projectId = this.configService.get<string>('gcs.projectId');
    const keyFilename = this.configService.get<string>('gcs.keyFilename');
    this.bucketName = this.configService.get<string>('gcs.bucketName')!;

    const storageOptions: any = {};
    if (projectId) {
      storageOptions.projectId = projectId;
    }
    if (keyFilename) {
      storageOptions.keyFilename = path.resolve(process.cwd(), keyFilename);
    }
    this.storage = new Storage(storageOptions);
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

      const expirySeconds =
        this.configService.get<number>('gcs.signedUrlExpirySeconds') || 900;

      const [url] = await file.getSignedUrl({
        action: 'write', // The document says client PUTs directly to signed URL
        contentType: 'application/octet-stream', // Generic or as specified
        expires: Date.now() + expirySeconds * 1000,
      });

      return url;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${fileName}`, error);
      throw new InternalServerErrorException('Could not generate signed URL');
    }
  }

  async getUploadPresignedUrl(
    fileName: string,
    mimetype: string,
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const uniqueFileName = `${Date.now()}-${fileName}`;
      const file = bucket.file(uniqueFileName);

      const expirySeconds =
        this.configService.get<number>('gcs.signedUrlExpirySeconds') || 900;

      const [uploadUrl] = await file.getSignedUrl({
        action: 'write',
        version: 'v4',
        expires: Date.now() + expirySeconds * 1000, // Valid for custom expiry
        contentType: mimetype,
      });

      const fileUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;

      return { uploadUrl, fileUrl };
    } catch (error) {
      this.logger.error(`Error generating upload signed URL for ${fileName}`, error);
      throw new InternalServerErrorException('Could not generate upload signed URL');
    }
  }
}
