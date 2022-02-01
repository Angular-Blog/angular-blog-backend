import {
  Column,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Post extends Model {
  @Column({ defaultValue: uuidv4, primaryKey: true })
  id: string;
  @Column
  text: string;
  @Column
  likes: number;
  @ForeignKey(() => User)
  @Column
  userId: string;
  @BelongsTo(() => User)
  user: User;
}
