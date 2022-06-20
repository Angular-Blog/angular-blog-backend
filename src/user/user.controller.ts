import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { AuthGuard } from '@nestjs/passport';
// import { LoginCredentials, RegistrationCredentials } from 'src/auth/authmodels';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get('/:name')
  getUser(@Param('name') name: string): Promise<User> {
    return this.userService.findByUser(name);
  }

  @UseGuards(AuthGuard())
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard())
  @Post('seedAll')
  seedAll(@Body('userData') userData: User[]): Promise<User[]> {
    return this.userService.seedAll(userData);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<string> {
    const userId = this.userService.remove(id);
    return userId;
  }
}
