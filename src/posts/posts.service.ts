import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user';
import { Post } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDto } from './dto/createPost.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(contentDto: PostDto, user: User): Promise<Post> {
    const post = new Post({
      content: contentDto.content,
      user: user,
      userId: user.id,
    });

    return this.postRepository.save(post);
  }

  async findByUser(user: User): Promise<Post[]> {
    try {
      console.log('User:', user);

      const posts = await this.postRepository.find({
        where: { userId: user.id },
      });
      return posts;
    } catch (error) {
      console.error('Error fetching posts for user:', error);
      throw new InternalServerErrorException('Failed to fetch posts for user');
    }
  }

  async likePost(postId: number, user: User): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likers'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.likers.push(user);
    return await this.postRepository.create(post);
  }

  async countLikes(postId: number): Promise<number> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likers'],
    });
    return post?.likers.length || 0;
  }

  async getLikers(postId: number): Promise<User[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likers'],
    });
    return post?.likers || [];
  }
}
