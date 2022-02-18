import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.model';
import { User } from '../user/user.model';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [SequelizeModule.forFeature([Post, User])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
