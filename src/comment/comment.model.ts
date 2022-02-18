import {
  Column,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';
import { CommentLike } from '../commentLike/commentLike.model';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Comment extends Model {
  @Column({ defaultValue: uuidv4, primaryKey: true })
  id: string;
  @Column({ allowNull: false })
  text: string;
  @Column({ defaultValue: 0 })
  likes: number;
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
  @BelongsToMany(() => User, () => CommentLike)
  likers: User[];
}
