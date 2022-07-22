import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
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
  @Get('name/:name')
  async getUser(@Param('name') name: string): Promise<User> {
    const user = await this.userService.findByUser(name);
    if (user) {
      return user;
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard())
  @Get('/all')
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard())
  @Get()
  async getSelf(@Req() request: any): Promise<User> {
    try {
      const userId = request.user.dataValues.id;
      const username = await this.userService.getUsernameFromId(userId);
      if (username) {
        return this.userService.findByUser(username);
      } else {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
    } catch {
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard())
  @Post('follow')
  async submitFollow(
    @Body('userId') followingId: string,
    @Req() request: any,
  ): Promise<string> {
    try {
      const followerId = request.user.dataValues.id;
      return this.userService.submitFollow(followerId, followingId);
    } catch (error) {
      throw error;
    }
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
