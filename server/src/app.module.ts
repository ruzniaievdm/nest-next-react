import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { FileModule } from './file/file.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    TrackModule,
    FileModule,
    MongooseModule.forRoot(
      'mongodb+srv://m001-student:m001@sandbox.ouken5c.mongodb.net/spotify?retryWrites=true&w=majority',
    ),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
  ],
})
export class AppModule {}
