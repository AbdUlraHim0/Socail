import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CurrentUser } from 'src/user/decorators';
import { User } from 'src/user';
import { AuthGuard } from 'src/user/guards';
import { Post as PostEntity } from './posts.entity';
import { PostDto } from './dto/createPost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() content: PostDto,
    @CurrentUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.create(content, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findByUser(@CurrentUser() user: User): Promise<{ data: PostEntity[] }> {
    const posts = await this.postsService.findByUser(user);
    console.log(posts);
    return { data: posts };
  }

  @UseGuards(AuthGuard)
  @Post(':postId/like')
  async likePost(
    @Param('postId') postId: number,
    @CurrentUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.likePost(postId, user);
  }

  @Get(':postId/likes/count')
  async countLikes(@Param('postId') postId: number): Promise<number> {
    return this.postsService.countLikes(postId);
  }

  @Get(':postId/likers')
  async getLikers(@Param('postId') postId: number): Promise<User[]> {
    return this.postsService.getLikers(postId);
  }
}
