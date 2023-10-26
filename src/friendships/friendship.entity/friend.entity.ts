import { AbstractEntity } from 'src/database/abstract.entity';
import { User } from 'src/user';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Friend extends AbstractEntity<Friend> {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  friend: User;

  @Column({ type: 'enum', enum: ['requested', 'accepted', 'blocked'] })
  status: 'requested' | 'accepted' | 'blocked';
}
