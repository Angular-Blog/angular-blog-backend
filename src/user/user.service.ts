import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Post } from '../post/post.model';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
      include: [
        { model: Post, as: 'posts' },
        { model: Post, as: 'likedPosts' },
      ],
    });
  }

  async remove(id: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({
        where: {
          id,
        },
      });
      await user.destroy();
      return `User ${id} deleted`;
    } catch (error) {
      return `User unable to be deleted. Error: ${error}`;
    }
  }

  async add(username: string, password: string, email: string): Promise<User> {
    try {
      let user: User;
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        user = await this.userModel.create(
          {
            username: username,
            password: await bcrypt.hash(password, 10),
            email: email,
          },
          transactionHost,
        );
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log(email);
      const user = await this.userModel.findOne({
        where: {
          email,
        },
      });
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      throw error;
    }
  }

  async seedAll(data: User[]): Promise<User[]> {
    try {
      const userList = [];
      data.forEach(async (user: User) => {
        await this.sequelize.transaction(async (t) => {
          const transactionHost = { transaction: t };
          const seededUser = await this.userModel.create(
            {
              username: user.username,
              password: await bcrypt.hash(user.password, 10),
              email: user.email,
            },
            transactionHost,
          );
          userList.push(seededUser);
        });
      });
      return userList;
    } catch (error) {
      throw error;
    }
  }
}
