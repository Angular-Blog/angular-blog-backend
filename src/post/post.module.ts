import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.model';
import { User } from '../user/user.model';
import { PostLike } from '../postLike/postLike.model';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [SequelizeModule.forFeature([Post, User, PostLike])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
