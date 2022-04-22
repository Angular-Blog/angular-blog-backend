import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginCredentials,
  RegistrationCredentials,
  RegistrationStatus,
} from './authmodels';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() credentials: RegistrationCredentials,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      credentials,
    );
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  public async login(@Body() credentials: LoginCredentials): Promise<any> {
    return await this.authService.login(credentials);
  }
}
