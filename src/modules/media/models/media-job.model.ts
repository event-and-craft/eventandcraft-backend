import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { Media } from './media.model';

export enum JobType {
  SECURITY_SCAN = 'SECURITY_SCAN',
  TRANSCODE = 'TRANSCODE',
  WATERMARK = 'WATERMARK',
}

export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Table({
  tableName: 'media_jobs',
  schema: 'media_server_schema',
  underscored: true,
})
export class MediaJob extends BaseModel<MediaJob> {
  @ForeignKey(() => Media)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  mediaId: string;

  @BelongsTo(() => Media)
  media: Media;

  @Column({
    type: DataType.ENUM(...Object.values(JobType)),
    allowNull: false,
  })
  jobType: JobType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bullJobId: string;

  @Column({
    type: DataType.ENUM(...Object.values(JobStatus)),
    defaultValue: JobStatus.PENDING,
  })
  status: JobStatus;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  progress: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  errorMsg: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date;
}
