import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Post } from 'src/posts';
import { Like } from 'src/feeds';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @ManyToMany(() => Post, (post) => post.likers)
  likedPosts: Post[];
}
