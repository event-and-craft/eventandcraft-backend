import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Language } from './models/language.model';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language)
    private readonly languageModel: typeof Language,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    const existing = await this.languageModel.findOne({
      where: { code: createLanguageDto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Language with code ${createLanguageDto.code} already exists`,
      );
    }
    return this.languageModel.create({ ...createLanguageDto });
  }

  async findAll(): Promise<Language[]> {
    return this.languageModel.findAll();
  }

  async findOne(id: string): Promise<Language> {
    const language = await this.languageModel.findByPk(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return language;
  }

  async update(
    id: string,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<Language> {
    const language = await this.findOne(id);

    if (updateLanguageDto.code && updateLanguageDto.code !== language.code) {
      const existing = await this.languageModel.findOne({
        where: { code: updateLanguageDto.code },
      });
      if (existing) {
        throw new ConflictException(
          `Language with code ${updateLanguageDto.code} already exists`,
        );
      }
    }

    await language.update(updateLanguageDto);
    return language;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const language = await this.findOne(id);
    await language.destroy();
    return { success: true, message: 'Language deleted successfully' };
  }
}
