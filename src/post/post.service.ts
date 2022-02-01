import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
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
    });
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await post.destroy();
  }
}
