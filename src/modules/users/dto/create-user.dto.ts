import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'johndoe', required: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'johndoe@example.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 1,
    description: '1: user, 2: creator',
    required: false,
  })
  @IsInt()
  @IsOptional()
  @IsEnum([1, 2], {
    message: 'userType must be either 1 (user) or 2 (creator)',
  })
  userType?: number;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  profileImg?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  isAdmin?: boolean;
}
