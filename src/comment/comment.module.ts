import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';

@Module({
  imports: [SequelizeModule.forFeature([Comment, Post, User])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
