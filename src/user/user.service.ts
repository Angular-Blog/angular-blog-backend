import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Post } from '../post/post.model';
import { Comment } from '../comment/comment.model';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { LoginCredentials, RegistrationCredentials } from 'src/auth/authmodels';
import { UserFollower } from 'src/userFollower/userFollower.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserFollower)
    private userFollowerModel: typeof UserFollower,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async getUsersFromUserFollowersList(
    idList: UserFollower[],
    idType: string,
  ): Promise<User[]> {
    const userList = [];
    for (let i = 0; i < idList.length; i++) {
      const user = await this.userModel.findOne({
        where: {
          id: idList[i][idType],
        },
      });
      userList.push(user);
    }
    return userList;
  }

  async findByUser(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        username,
      },
      include: [
        { model: Post, as: 'posts' },
        { model: Post, as: 'likedPosts' },
        { model: Comment, as: 'likedComments' },
        {
          model: User,
          as: 'following',
          attributes: ['id', 'username'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'followers',
          attributes: ['id', 'username'],
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ['password'] },
    });
    const followerIds = await this.userFollowerModel.findAll({
      where: {
        followingId: user.id,
      },
      attributes: ['followerId'],
    });
    const followingIds = await this.userFollowerModel.findAll({
      where: {
        followerId: user.id,
      },
      attributes: ['followingId'],
    });
    user.following = await this.getUsersFromUserFollowersList(
      followingIds,
      'followingId',
    );
    user.followers = await this.getUsersFromUserFollowersList(
      followerIds,
      'followerId',
    );
    console.log(`USER: ${JSON.stringify(user.followers)}`);
    return user;
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

  async findByPayload(username: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async getUsernameFromId(id: string): Promise<string> {
    const user = await this.userModel.findOne({
      where: {
        id,
      },
    });
    return user.username;
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

  async submitFollow(followerId: string, followingId: string): Promise<string> {
    try {
      const userFollower = await this.userFollowerModel.findAll({
        where: {
          followerId: followerId,
        },
      });
      let existingFollow = false;
      userFollower.forEach(async (pair) => {
        if (pair.followingId == followingId) {
          existingFollow = true;
          await pair.destroy();
        }
      });
      if (!existingFollow) {
        await this.sequelize.transaction(async (t) => {
          const transactionHost = { transaction: t };
          await this.userFollowerModel.create(
            {
              followerId: followerId,
              followingId: followingId,
            },
            transactionHost,
          );
        });
        return `User ${followingId} followed by ${followerId}`;
      } else {
        return `User ${followingId} unfollowed by ${followerId}`;
      }
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
