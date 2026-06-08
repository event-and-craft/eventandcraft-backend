import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';

@Table({
  tableName: 'languages',
})
export class Language extends BaseModel<Language> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'active',
  })
  status: string;
}
