import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { User } from '../../users/models/user.model';
import { MediaVariant } from './media-variant.model';
import { MediaJob } from './media-job.model';
import { SecurityScanResult } from './security-scan-result.model';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum MediaStatus {
  PENDING = 'PENDING',
  SCANNING = 'SCANNING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  REJECTED = 'REJECTED',
}

@Table({
  tableName: 'media',
  schema: 'media_server_schema',
  underscored: true,
})
export class Media extends BaseModel<Media> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.ENUM(...Object.values(MediaType)),
    allowNull: false,
  })
  type: MediaType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  originalName: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  originalSize: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mimeType: string;

  @Column({
    type: DataType.ENUM(...Object.values(MediaStatus)),
    defaultValue: MediaStatus.PENDING,
  })
  status: MediaStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  rejectionReason: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  width: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  height: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  durationSeconds: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gcsPathRaw: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  fileMetadata: any;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  watermarkEnabled: boolean;

  @HasMany(() => MediaVariant)
  variants: MediaVariant[];

  @HasMany(() => MediaJob)
  jobs: MediaJob[];

  @HasMany(() => SecurityScanResult)
  scanResults: SecurityScanResult[];
}
