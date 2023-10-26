import { Module } from '@nestjs/common';
import { Post } from './posts.entity';
import { DatabaseModule } from 'src/database/database.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [DatabaseModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
