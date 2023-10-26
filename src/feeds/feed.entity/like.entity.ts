import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from 'src/database/abstract.entity';
import { User } from 'src/user';
import { Post } from 'src/posts';

@Entity()
export class Like extends AbstractEntity<Like> {
  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  postId: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
