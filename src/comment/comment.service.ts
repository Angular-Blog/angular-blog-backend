import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private commentModel: typeof Comment,
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentModel.findAll();
  }

  findOne(id: string): Promise<Comment> {
    return this.commentModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<string> {
    try {
      const comment = await this.commentModel.findOne({
        where: {
          id,
        },
      });
      await comment.destroy();
      return `Comment ${id} deleted`;
    } catch (error) {
      return `Comment unable to be deleted. Error: ${error}`;
    }
  }

  async add(text: string, userId: string, postId: string): Promise<Comment> {
    try {
      let comment: Comment;
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        comment = await this.commentModel.create(
          {
            text: text,
            userId: userId,
            postId: postId,
          },
          transactionHost,
        );
      });
      return comment;
    } catch (error) {
      throw error;
    }
  }

  async seedRandom(commentData: string[]): Promise<Comment[]> {
    try {
      const commentList = [];
      const userData = await this.userModel.findAll();
      const postData = await this.postModel.findAll();
      commentData.forEach(async (comment) => {
        const userId = userData[Math.round(Math.random() * userData.length)].id;
        const postId = postData[Math.round(Math.random() * postData.length)].id;
        await this.sequelize.transaction(async (t) => {
          const transactionHost = { transaction: t };
          const seededComment = await this.commentModel.create(
            {
              text: comment,
              userId: userId,
              postId: postId,
            },
            transactionHost,
          );
          commentList.push(seededComment);
        });
      });
      return commentList;
    } catch (error) {
      throw error;
    }
  }
}
