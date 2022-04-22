import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  LoginCredentials,
  RegistrationCredentials,
  RegistrationStatus,
} from './authmodels';
import { JwtPayload } from './jwtpayload';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    credentials: RegistrationCredentials,
  ): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.userService.add(credentials);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(credentials: LoginCredentials): Promise<any> {
    const user = await this.userService.findByLogin(credentials);
    const token = this._createToken(user);
    return {
      username: user.username,
      ...token,
    };
  }

  private _createToken({ username }: any): any {
    const user: JwtPayload = { username };
    const token = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
