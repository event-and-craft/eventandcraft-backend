import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { WhereOptions } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(filters?: Partial<User>): Promise<User[]> {
    const where: WhereOptions<User> = {};
    if (filters) {
      if (filters.name) where.name = filters.name;
      if (filters.username) where.username = filters.username;
      if (filters.email) where.email = filters.email;
      if (filters.mobile) where.mobile = filters.mobile;
      if (filters.firebaseUid) where.firebaseUid = filters.firebaseUid;
      if (filters.status) where.status = filters.status;
      if (filters.isAdmin !== undefined) where.isAdmin = filters.isAdmin;
      if (filters.userType !== undefined) where.userType = filters.userType;
    }
    return this.userModel.findAll({ where });
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ where: { mobile: phoneNumber } });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.userModel.findOne({ where: { mobile } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userModel.findOne({ where: { firebaseUid } });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) return null;
    return user.update(updateData);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await user.destroy(); // Soft delete because of paranoid: true
    }
  }
}
