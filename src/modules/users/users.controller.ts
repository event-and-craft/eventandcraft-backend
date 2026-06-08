import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../../common/utils/crypto';
import { FileStorageService } from '../storage/storage.service';
import { Request as ExpressRequest } from 'express';

// Extend Express Request to include our custom user payload
interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    sub?: string;
    email?: string;
    phoneNumber?: string;
  };
}

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest) {
    // sub is used in JwtAuthGuard, userId is used in JwtStrategy
    const userId = req.user.sub || req.user.userId;
    if (!userId) {
      throw new NotFoundException('User ID not found in token');
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAll(@Query() query: Partial<User>) {
    if (query.id) {
      const user = await this.usersService.findOne(query.id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    }
    return this.usersService.findAll(query);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const data: Partial<User> = {
      ...createUserDto,
      authType: 'emailandpassword',
    };
    if (data.password) {
      data.password = hashPassword(data.password);
    }
    return this.usersService.create(data);
  }

  @UseGuards(AdminGuard)
  @Post('presigned-url')
  async getPresignedUrl(
    @Body('fileName') fileName: string,
    @Body('fileType') fileType: string,
  ) {
    if (!fileName || !fileType) {
      throw new BadRequestException('fileName and fileType are required');
    }
    return this.fileStorageService.getUploadPresignedUrl(fileName, fileType);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateUserDto>,
  ) {
    const data: Partial<User> = { ...updateData };
    if (data.password) {
      data.password = hashPassword(data.password);
    }
    const updatedUser = await this.usersService.update(id, data);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
