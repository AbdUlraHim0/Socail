import { Module } from '@nestjs/common';
import { Like } from './feed.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({ imports: [DatabaseModule, DatabaseModule.forFeature([Like])] })
export class FeedsModule {}
