import { Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';

@Table
export class PostLike extends Model {
  @ForeignKey(() => User)
  @Column
  userId: string;
  @ForeignKey(() => Post)
  @Column
  postId: string;
}
