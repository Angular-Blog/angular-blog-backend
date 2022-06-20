import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginCredentials, RegistrationCredentials } from './authmodels';
import { JwtPayload } from './jwtpayload';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(credentials: RegistrationCredentials): Promise<any> {
    await this.userService.add(credentials);
    const user = await this.userService.findByPayload(credentials.username);
    const token = this._createToken(user);
    return {
      username: user.username,
      ...token,
    };
  }

  async login(credentials: LoginCredentials): Promise<any> {
    const user = await this.userService.findByLogin(credentials);
    const token = this._createToken(user);
    return {
      username: user.username,
      ...token,
    };
  }

  private _createToken({ username, id }: any): any {
    const user: JwtPayload = { username, id };
    const token = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByPayload(payload.username);
    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
