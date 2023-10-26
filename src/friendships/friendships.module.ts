import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Friend } from './friendship.entity/friend.entity';

@Module({ imports: [DatabaseModule, DatabaseModule.forFeature([Friend])] })
export class FriendshipsModule {}
