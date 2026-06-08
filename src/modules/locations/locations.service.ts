import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Location } from './models/location.model';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location)
    private readonly locationModel: typeof Location,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationModel.create({ ...createLocationDto });
  }

  async findAll(): Promise<Location[]> {
    return this.locationModel.findAll();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationModel.findByPk(id);
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);
    await location.update(updateLocationDto);
    return location;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const location = await this.findOne(id);
    await location.destroy();
    return { success: true, message: 'Location deleted successfully' };
  }
}
