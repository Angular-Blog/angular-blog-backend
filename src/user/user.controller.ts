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
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }
  @Post('seedAll')
  seedAll(@Body('userData') userData: User[]): Promise<User[]> {
    return this.userService.seedAll(userData);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<string> {
    const userId = this.userService.remove(id);
    return userId;
  }
}
