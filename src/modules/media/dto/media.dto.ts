import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../models/media.model';

export class InitiateUploadDto {
  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  @IsNumber()
  size: number;

  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  watermarkEnabled?: boolean;
}

export class CompleteUploadDto {
  @ApiProperty()
  @IsString()
  mediaId: string;
}
