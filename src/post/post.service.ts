import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { Comment } from '../comment/comment.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postModel.findAll();
  }

  findOne(id: string): Promise<Post> {
    return this.postModel.findOne({
      where: {
        id,
      },
      include: Comment,
    });
  }

  async remove(id: string): Promise<string> {
    try {
      const post = await this.postModel.findOne({
        where: {
          id,
        },
      });
      await post.destroy();
      return `Post ${id} deleted`;
    } catch (error) {
      return `Post unable to be deleted. Error: ${error}`;
    }
  }

  async add(text: string, userId: string): Promise<Post> {
    try {
      let post: Post;
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        post = await this.postModel.create(
          {
            text: text,
            userId: userId,
          },
          transactionHost,
        );
      });
      return post;
    } catch (error) {
      throw error;
    }
  }
}
