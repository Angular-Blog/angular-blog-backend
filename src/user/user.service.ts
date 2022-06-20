import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Post } from '../post/post.model';
import { Comment } from '../comment/comment.model';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { LoginCredentials, RegistrationCredentials } from 'src/auth/authmodels';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  findByUser(username: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        username,
      },
      include: [
        { model: Post, as: 'posts' },
        { model: Post, as: 'likedPosts' },
        { model: Comment, as: 'likedComments' },
      ],
      attributes: { exclude: ['password'] },
    });
  }

  async findByLogin(creds: LoginCredentials): Promise<User> {
    const { email, password } = creds;
    try {
      const user = await this.userModel.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED);
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByPayload(username: any): Promise<User> {
    return await this.userModel.findOne({
      where: {
        username,
      },
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
      throw `User unable to be deleted. Error: ${error}`;
    }
  }

  async add(creds: RegistrationCredentials): Promise<User> {
    const { username, password, email } = creds;
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
    } catch (err) {
      const error = err.errors[0].message || '';
      switch (error) {
        case 'username must be unique':
          throw new HttpException(
            'Username already in use',
            HttpStatus.BAD_REQUEST,
          );
        case 'email must be unique':
          throw new HttpException(
            'Email already in use',
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException('Registration error', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async login(creds: LoginCredentials): Promise<User> {
    const { email, password } = creds;
    try {
      const user = await this.userModel.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED);
      }
      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }
      return user;
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
