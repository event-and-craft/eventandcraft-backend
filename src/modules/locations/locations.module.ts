import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './models/location.model';

@Module({
  imports: [SequelizeModule.forFeature([Location])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService, SequelizeModule],
})
export class LocationsModule {}
