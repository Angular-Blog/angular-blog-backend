import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { User } from '../user/user.model';
import { PostLike } from '../postLike/postLike.model';
import { Comment } from '../comment/comment.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(PostLike)
    private postLikeModel: typeof PostLike,
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

  async findByUser(userId: string): Promise<Post[]> {
    return this.postModel.findAll({
      where: {
        userId,
      },
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
      ],
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

  async submitLike(userId: string, postId: string): Promise<string> {
    try {
      const likedPost = await this.postModel.findOne({
        where: {
          id: postId,
        },
      });
      const userLikes = await this.postLikeModel.findAll({
        where: {
          userId: userId,
        },
      });
      let existingLike = false;
      userLikes.forEach(async (like) => {
        if (like.postId === postId) {
          existingLike = true;
          likedPost.likes -= 1;
          await like.destroy();
          await likedPost.save();
        }
      });
      if (existingLike) {
        return `Post ${postId} unliked by ${userId}`;
      } else {
        likedPost.likes += 1;
        await likedPost.save();
        await this.sequelize.transaction(async (t) => {
          const transactionHost = { transaction: t };
          await this.postLikeModel.create(
            {
              userId: userId,
              postId: postId,
            },
            transactionHost,
          );
        });
        return `Post ${postId} liked by ${userId}`;
      }
    } catch (error) {
      throw error;
    }
  }
}
