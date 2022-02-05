import {
  Column,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Comment extends Model {
  @Column({ defaultValue: uuidv4, primaryKey: true })
  id: string;
  @Column({ allowNull: false, unique: true })
  text: string;
  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: string;
  @BelongsTo(() => User)
  user: User;
  @ForeignKey(() => Post)
  @Column({ allowNull: false })
  postId: string;
  @BelongsTo(() => Post)
  post: Post;
}
