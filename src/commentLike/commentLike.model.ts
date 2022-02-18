import { Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Comment } from '../comment/comment.model';

@Table
export class CommentLike extends Model {
  @ForeignKey(() => User)
  @Column
  userId: string;
  @ForeignKey(() => Comment)
  @Column
  commentId: string;
}
