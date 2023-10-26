import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { User } from 'src/user';
import { Post } from 'src/posts';
import { Like } from 'src/feeds';
import { Friend } from 'src/friendships/friendship.entity/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRESQL_HOST'),
        port: configService.getOrThrow('POSTGRESQL_PORT'),
        database: configService.getOrThrow('POSTGRESQL_DATABASE'),
        username: configService.getOrThrow('POSTGRESQL_USER'),
        password: configService.getOrThrow('POSTGRESQL_PASSWORD'),
        synchronize: configService.getOrThrow('POSTGRESQL_SYNCHRONIZE'),
        autoLoadEntities: true,
        entities: [User, Post, Like, Friend],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entities: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
