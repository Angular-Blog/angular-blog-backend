import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { User } from '../user/user.model';
import { Comment } from '../comment/comment.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(User)
    private userModel: typeof User,
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

  async seedRandom(postData: string[]): Promise<Post[]> {
    try {
      const postList = [];
      postData.forEach(async (post) => {
        const userList = await this.userModel.findAll();
        const userId = userList[Math.round(Math.random() * userList.length)].id;
        await this.sequelize.transaction(async (t) => {
          const transactionHost = { transaction: t };
          const seededPost = await this.postModel.create(
            {
              text: post,
              userId: userId,
            },
            transactionHost,
          );
          postList.push(seededPost);
        });
      });
      return postList;
    } catch (error) {
      throw error;
    }
  }
}
