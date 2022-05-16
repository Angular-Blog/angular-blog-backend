import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentials, RegistrationCredentials } from './authmodels';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() credentials: RegistrationCredentials,
  ): Promise<any> {
    return await this.authService.register(credentials);
  }

  @Post('login')
  public async login(@Body() credentials: LoginCredentials): Promise<any> {
    return await this.authService.login(credentials);
  }
}
