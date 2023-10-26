import { AbstractEntity } from 'src/database/abstract.entity';
import { Like } from 'src/feeds';
import { User } from 'src/user';
import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Post extends AbstractEntity<Post> {
  @Column()
  content: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable()
  likers: User[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
