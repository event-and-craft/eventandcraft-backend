import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Media, MediaType, MediaStatus } from './models/media.model';
import { MediaJob, JobType } from './models/media-job.model';
import { FileStorageService } from '../storage/storage.service';
import { InitiateUploadDto } from './dto/media.dto';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';

@Injectable()
export class MediaService {
  private progressSubjects = new Map<string, Subject<any>>();

  constructor(
    @InjectModel(Media) private mediaModel: typeof Media,
    @InjectModel(MediaJob) private mediaJobModel: typeof MediaJob,
    @InjectQueue('media_processing') private mediaQueue: Queue,
    private storageService: FileStorageService,
  ) {}

  async initiateUpload(userId: string, dto: InitiateUploadDto) {
    const mediaId = uuidv4();
    const extension = dto.filename.split('.').pop();
    const gcsPathRaw = `staging/${mediaId}/raw.${extension}`;

    const media = await this.mediaModel.create({
      id: mediaId,
      userId,
      type: dto.type,
      originalName: dto.filename,
      originalSize: dto.size,
      mimeType: dto.mimeType,
      gcsPathRaw,
      watermarkEnabled: dto.watermarkEnabled || false,
      status: MediaStatus.PENDING,
    });

    const uploadUrl = await this.storageService.getSignedUrl(gcsPathRaw);

    return {
      mediaId: media.id,
      uploadUrl,
      gcsPathRaw,
    };
  }

  async completeUpload(mediaId: string) {
    const media = await this.mediaModel.findByPk(mediaId);
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const job = await this.mediaJobModel.create({
      mediaId: media.id,
      jobType: JobType.SECURITY_SCAN,
      status: MediaStatus.PENDING,
    });

    const bullJob = await this.mediaQueue.add('process_media', {
      mediaId: media.id,
      jobId: job.id,
    });

    await job.update({ bullJobId: bullJob.id });
    await media.update({ status: MediaStatus.SCANNING });

    return { jobId: job.id, bullJobId: bullJob.id };
  }

  getProgressSubject(mediaId: string): Subject<any> {
    if (!this.progressSubjects.has(mediaId)) {
      this.progressSubjects.set(mediaId, new Subject<any>());
    }
    return this.progressSubjects.get(mediaId)!;
  }

  publishProgress(mediaId: string, data: any) {
    const subject = this.progressSubjects.get(mediaId);
    if (subject) {
      subject.next(data);
      if (data.progress === 100) {
        subject.complete();
        this.progressSubjects.delete(mediaId);
      }
    }
  }

  async getMediaStatus(mediaId: string) {
    const media = await this.mediaModel.findByPk(mediaId, {
      include: [MediaJob],
    });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }
}
