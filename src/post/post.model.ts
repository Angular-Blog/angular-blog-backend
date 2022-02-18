import {
  Column,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Comment } from '../comment/comment.model';
import { PostLike } from '../postLike/postLike.model';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Post extends Model {
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
  @HasMany(() => Comment)
  comments: Comment[];
  @BelongsToMany(() => User, () => PostLike)
  likers: User[];
}
