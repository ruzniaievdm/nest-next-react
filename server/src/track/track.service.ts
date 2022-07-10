import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateTrackDto } from './dtos/create-track.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Track, TrackDocument } from './schemas/track.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);

    return await this.trackModel.create({
      ...dto,
      listens: 0,
      picture: picturePath,
      audio: audioPath,
    });
  }

  async getOne(id: Types.ObjectId): Promise<Track> {
    return await this.trackModel.findById(id).populate('comments');
  }

  async findAll(count = 10, offset = 0): Promise<Track[]> {
    return await this.trackModel.find().skip(offset).limit(count);
  }

  async search(query: string): Promise<Track[]> {
    console.log('search');

    return await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
  }

  async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track.id;
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: Types.ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }
}
