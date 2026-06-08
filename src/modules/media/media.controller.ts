import { Controller, Post, Get, Body, Param, Sse, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { InitiateUploadDto, CompleteUploadDto } from './dto/media.dto';
import { Observable, map } from 'rxjs';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload/initiate')
  @ApiOperation({ summary: 'Initiate a media upload' })
  // @UseGuards(JwtAuthGuard) // Assuming there is a JwtAuthGuard
  // @ApiBearerAuth()
  async initiateUpload(@Body() dto: InitiateUploadDto, @Req() req: any) {
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000000'; // Fallback for dev
    return this.mediaService.initiateUpload(userId, dto);
  }

  @Post('upload/complete')
  @ApiOperation({ summary: 'Mark upload as complete and start processing' })
  async completeUpload(@Body() dto: CompleteUploadDto) {
    return this.mediaService.completeUpload(dto.mediaId);
  }

  @Sse('upload/progress/:id')
  @ApiOperation({ summary: 'Get real-time progress via SSE' })
  progress(@Param('id') id: string): Observable<MessageEvent> {
    return this.mediaService.getProgressSubject(id).pipe(
      map((data) => ({ data } as MessageEvent)),
    );
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get media status and jobs' })
  async getStatus(@Param('id') id: string) {
    return this.mediaService.getMediaStatus(id);
  }
}

interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}
