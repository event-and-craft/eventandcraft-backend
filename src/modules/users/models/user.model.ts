import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';

@Table({
  tableName: 'users',
  underscored: true,
})
export class User extends BaseModel<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileImg: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  mobile: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAdmin: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1, // 0:admin, 1:user, 2:creator
  })
  userType: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  authType: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  optmisticLock: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'active', // active, blocked, pending-verification
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  updatedUBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  firebaseUid: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  refreshToken: string;
}
