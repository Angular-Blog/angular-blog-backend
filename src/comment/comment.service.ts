import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private commentModel: typeof Comment,
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
}
