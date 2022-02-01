import { Column, Table, Model, HasMany } from 'sequelize-typescript';
import { Post } from '../post/post.model';
import { v4 as uuidv4 } from 'uuid';

@Table
export class User extends Model {
  @Column({ defaultValue: uuidv4, primaryKey: true })
  id: string;
  @Column
  username: string;
  @Column
  password: string;
  @HasMany(() => Post)
  posts: Post[];
}
