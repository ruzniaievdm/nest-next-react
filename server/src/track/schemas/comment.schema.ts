import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Track } from './track.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Track' })
  track: Track;

  @Prop()
  username: string;

  @Prop()
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
