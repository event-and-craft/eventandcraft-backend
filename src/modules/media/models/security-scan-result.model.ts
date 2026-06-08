import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { Media } from './media.model';

@Table({
  tableName: 'security_scan_results',
  schema: 'media_server_schema',
  underscored: true,
})
export class SecurityScanResult extends BaseModel<SecurityScanResult> {
  @ForeignKey(() => Media)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  mediaId: string;

  @BelongsTo(() => Media)
  media: Media;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  scanType: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  passed: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  details: any;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  scannedAt: Date;
}
