import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateTrackDto } from './dtos/create-track.dto';
import { TrackService } from './track.service';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
    console.log(files);
    const { picture, audio } = files;
    return this.trackService.create(dto, picture[0], audio[0]);
  }

  @Get(':id')
  getOne(@Param('id') id: Types.ObjectId) {
    return this.trackService.getOne(id);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query);
  }

  @Get()
  findAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.trackService.findAll(count, offset);
  }

  @Delete(':id')
  delete(@Param('id') id: Types.ObjectId) {
    return this.trackService.delete(id);
  }

  @Post('/comment')
  addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: Types.ObjectId) {
    return this.trackService.listen(id);
  }
}
