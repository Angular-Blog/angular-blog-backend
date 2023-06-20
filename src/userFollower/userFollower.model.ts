import { Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class UserFollower extends Model {
  @Column({ unique: false })
  followerId: string;
  @Column({ unique: false })
  followingId: string;
}
