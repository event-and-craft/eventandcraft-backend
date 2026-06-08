import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cms } from './models/cms.model';

@Injectable()
export class CmsService {
  constructor(
    @InjectModel(Cms)
    private readonly cmsModel: typeof Cms,
  ) {}

  async findAll(): Promise<Cms[]> {
    return this.cmsModel.findAll({
      order: [['key', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Cms> {
    const cms = await this.cmsModel.findByPk(id);
    if (!cms) {
      throw new NotFoundException(`CMS setting with ID ${id} not found`);
    }
    return cms;
  }

  async findByKey(key: string): Promise<Cms> {
    const cms = await this.cmsModel.findOne({ where: { key } });
    if (!cms) {
      throw new NotFoundException(`CMS setting with key "${key}" not found`);
    }
    return cms;
  }

  async update(id: string, value: any): Promise<Cms> {
    const cms = await this.findOne(id);
    cms.value = value;
    await cms.save();
    return cms;
  }

  async create(data: Partial<Cms>): Promise<Cms> {
    return this.cmsModel.create(data);
  }
}
