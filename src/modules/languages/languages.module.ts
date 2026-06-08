import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { Language } from './models/language.model';

@Module({
  imports: [SequelizeModule.forFeature([Language])],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService, SequelizeModule],
})
export class LanguagesModule {}
