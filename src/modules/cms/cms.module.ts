import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { Cms } from './models/cms.model';

@Module({
  imports: [SequelizeModule.forFeature([Cms])],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService, SequelizeModule],
})
export class CmsModule {}
