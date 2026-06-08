import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';

@Table({
  tableName: 'cms_settings',
})
export class Cms extends BaseModel<Cms> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare key: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('value');
      try {
        return rawValue ? JSON.parse(rawValue) : null;
      } catch {
        return rawValue;
      }
    },
    set(val: any) {
      if (typeof val === 'string') {
        this.setDataValue('value', val);
      } else {
        this.setDataValue('value', JSON.stringify(val));
      }
    },
  })
  declare value: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description: string;
}
