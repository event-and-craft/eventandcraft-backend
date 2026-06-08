import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'The name of the language (e.g. English, Arabic)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The unique language code (e.g. en, ar)' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    required: false,
    enum: ['active', 'inactive'],
    default: 'active',
    description: 'Status of the language',
  })
  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
