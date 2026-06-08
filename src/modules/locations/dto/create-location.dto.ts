import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ description: 'The name of the location' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Detailed description of the location',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    enum: ['active', 'inactive'],
    default: 'active',
    description: 'Status of the location',
  })
  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Coordinates or map pointer details',
  })
  @IsString()
  @IsOptional()
  mapPointer?: string;
}
