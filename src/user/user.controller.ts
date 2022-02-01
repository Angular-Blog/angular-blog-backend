import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ): Promise<string> {
    try {
      const user = await this.userService.add(username, password, email);
      return `User ${user.username} Created with ID ${user.id}`;
    } catch (error) {
      return `Unable to Create User: ${error}`;
    }
  }
  @Post('login')
  loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<boolean> {
    const loggedIn = this.userService.login(email, password);
    return loggedIn;
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<string> {
    const userId = this.userService.remove(id);
    return userId;
  }
}
