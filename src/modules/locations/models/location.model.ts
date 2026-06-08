import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';

@Table({
  tableName: 'locations',
})
export class Location extends BaseModel<Location> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'active',
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'map_pointer',
  })
  mapPointer: string;
}
