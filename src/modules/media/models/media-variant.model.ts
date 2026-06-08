import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { Media } from './media.model';

export enum VariantType {
  ORIGINAL = 'ORIGINAL',
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
  THUMBNAIL = 'THUMBNAIL',
  HLS_MASTER = 'HLS_MASTER',
  HLS_PLAYLIST = 'HLS_PLAYLIST',
  HLS_SEGMENT = 'HLS_SEGMENT',
  ANIMATED_PREVIEW = 'ANIMATED_PREVIEW',
}

@Table({
  tableName: 'media_variants',
  schema: 'media_server_schema',
  underscored: true,
})
export class MediaVariant extends BaseModel<MediaVariant> {
  @ForeignKey(() => Media)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  mediaId: string;

  @BelongsTo(() => Media)
  media: Media;

  @Column({
    type: DataType.ENUM(...Object.values(VariantType)),
    allowNull: false,
  })
  variantType: VariantType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  qualityLabel: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gcsPath: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  cdnUrl: string;

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
    type: DataType.BIGINT,
    allowNull: true,
  })
  fileSize: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  bitrateKbps: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  codec: string;
}
