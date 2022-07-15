import { Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class UserFollower extends Model {
  @ForeignKey(() => User)
  @Column
  followerId: string;
  @ForeignKey(() => User)
  @Column
  followingId: string;
}
