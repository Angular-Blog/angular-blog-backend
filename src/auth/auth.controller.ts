import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentials, RegistrationCredentials } from './authmodels';
import { User } from 'src/user/user.model';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard())
  @Get('tokenCheck')
  public checkToken(@Req() request: any): User {
    return request.user;
  }
}
