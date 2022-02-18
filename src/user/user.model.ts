import {
  Column,
  Table,
  Model,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Post } from '../post/post.model';
import { Comment } from '../comment/comment.model';
import { PostLike } from '../postLike/postLike.model';
import { CommentLike } from '../commentLike/commentLike.model';
import { v4 as uuidv4 } from 'uuid';

@Table
export class User extends Model {
  @Column({ defaultValue: uuidv4, primaryKey: true })
  id: string;
  @Column({ allowNull: false, unique: true })
  username: string;
  @Column({ allowNull: false, unique: true })
  email: string;
  @Column({ allowNull: false })
  password: string;
  @HasMany(() => Post)
  posts: Post[];
  @HasMany(() => Comment)
  comments: Comment[];
  @BelongsToMany(() => Post, () => PostLike)
  likedPosts: Post[];
  @BelongsToMany(() => Comment, () => CommentLike)
  likedComments: Comment[];
}
