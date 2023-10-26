import { Injectable, Logger } from '@nestjs/common';
import { Post } from './posts.entity';
import { AbstractRepository } from 'src/database/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PostsRepository extends AbstractRepository<Post> {
  protected readonly logger = new Logger(PostsRepository.name);

  constructor(
    @InjectRepository(Post)
    public readonly itemsRepository: Repository<Post>,
    entityManager: EntityManager,
  ) {
    super(itemsRepository, entityManager);
  }
}
