import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/sequelize';
import { Media, MediaStatus, MediaType } from '../models/media.model';
import { MediaJob, JobStatus } from '../models/media-job.model';
import { MediaVariant, VariantType } from '../models/media-variant.model';
import { SecurityScanResult } from '../models/security-scan-result.model';
import { MediaService } from '../media.service';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { filetypemime } from 'magic-bytes.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FileStorageService } from '../../storage/storage.service';
import * as ffmpeg from 'fluent-ffmpeg';

@Processor('media_processing')
export class MediaProcessor extends WorkerHost {
  constructor(
    @InjectModel(Media) private mediaModel: typeof Media,
    @InjectModel(MediaJob) private mediaJobModel: typeof MediaJob,
    @InjectModel(MediaVariant) private mediaVariantModel: typeof MediaVariant,
    @InjectModel(SecurityScanResult) private securityScanResultModel: typeof SecurityScanResult,
    private mediaService: MediaService,
    private storageService: FileStorageService,
    private configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { mediaId, jobId } = job.data;
    const media = await this.mediaModel.findByPk(mediaId);
    const mediaJob = await this.mediaJobModel.findByPk(jobId);

    if (!media || !mediaJob) return;

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'media-'));
    try {
      await mediaJob.update({ status: JobStatus.RUNNING, startedAt: new Date() });
      this.mediaService.publishProgress(mediaId, { step: 'STARTING', progress: 0 });

      // 1. In real scenario, download file from GCS here.
      // For now we assume localRawPath exists after download.
      const extension = media.gcsPathRaw.split('.').pop();
      const localRawPath = path.join(tempDir, `raw.${extension}`);

      // Simulating download (would use storageService.download or similar)
      // fs.writeFileSync(localRawPath, await this.storageService.getFileBuffer(media.gcsPathRaw));

      this.mediaService.publishProgress(mediaId, { step: 'SCANNING', progress: 10 });

      // 2. Security Scan
      const passScan = await this.runSecurityScan(media, localRawPath);
      if (!passScan) {
        await media.update({ status: MediaStatus.REJECTED, rejectionReason: 'Security scan failed' });
        await mediaJob.update({ status: JobStatus.FAILED, errorMsg: 'Security scan failed' });
        this.mediaService.publishProgress(mediaId, { step: 'REJECTED', progress: 100 });
        return;
      }

      await media.update({ status: MediaStatus.PROCESSING });
      this.mediaService.publishProgress(mediaId, { step: 'PROCESSING', progress: 40 });

      // 3. Transcoding / Resizing
      if (media.type === MediaType.IMAGE) {
        await this.processImage(media, localRawPath);
      } else if (media.type === MediaType.VIDEO) {
        await this.processVideo(media, localRawPath);
      }

      // 4. Finalize
      await media.update({ status: MediaStatus.READY });
      await mediaJob.update({ status: JobStatus.COMPLETED, completedAt: new Date(), progress: 100 });
      this.mediaService.publishProgress(mediaId, { step: 'READY', progress: 100 });

    } catch (error) {
      console.error('Processing error:', error);
      await mediaJob.update({ status: JobStatus.FAILED, errorMsg: error.message });
      await media.update({ status: MediaStatus.REJECTED, rejectionReason: error.message });
      this.mediaService.publishProgress(mediaId, { step: 'FAILED', progress: 100, error: error.message });
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  private async runSecurityScan(media: Media, localPath: string): Promise<boolean> {
    const fileBuffer = fs.existsSync(localPath) ? fs.readFileSync(localPath) : Buffer.alloc(0);
    const mimes = filetypemime(fileBuffer);

    const mimePassed = mimes.length === 0 || mimes.includes(media.mimeType);

    await this.securityScanResultModel.create({
      mediaId: media.id,
      scanType: 'MIME_CHECK',
      passed: mimePassed,
      details: { detectedMimes: mimes, expectedMime: media.mimeType },
    });

    if (!mimePassed) return false;

    // EXIF Stripping for images
    if (media.type === MediaType.IMAGE && fs.existsSync(localPath)) {
      const cleanPath = localPath + '.clean';
      await sharp(localPath).toFile(cleanPath);
      fs.renameSync(cleanPath, localPath);
    }

    return true;
  }

  private async processImage(media: Media, localPath: string) {
    const variants = [
      { type: VariantType.LARGE, width: 1200 },
      { type: VariantType.MEDIUM, width: 800 },
      { type: VariantType.THUMBNAIL, width: 200 },
    ];

    for (const variant of variants) {
      const outputPath = `media/${media.id}/image/${variant.type.toLowerCase()}.webp`;

      if (fs.existsSync(localPath)) {
        const buffer = await sharp(localPath).resize(variant.width).webp().toBuffer();
        await this.storageService.uploadFile(buffer, `${variant.type.toLowerCase()}.webp`, 'image/webp');
      }

      await this.mediaVariantModel.create({
        mediaId: media.id,
        variantType: variant.type,
        gcsPath: outputPath,
        width: variant.width,
      });
    }
  }

  private async processVideo(media: Media, localPath: string) {
    // Basic ffmpeg stub
    // ffmpeg(localPath).outputOptions('-map_metadata -1').save(localPath + '.clean');
  }
}
