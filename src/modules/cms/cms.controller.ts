import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @ApiOperation({ summary: 'Get all CMS configurations' })
  @Get()
  findAll() {
    return this.cmsService.findAll();
  }

  @ApiOperation({ summary: 'Get a specific CMS configuration by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cmsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get a specific CMS configuration by Key' })
  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.cmsService.findByKey(key);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a CMS configuration (Admin only)' })
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() body: any) {
    const value = body.value;
    return this.cmsService.update(id, value);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a CMS configuration (Admin only)' })
  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() body: any) {
    const value = body.value;
    return this.cmsService.update(id, value);
  }
}
