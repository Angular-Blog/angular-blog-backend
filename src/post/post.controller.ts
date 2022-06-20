import {
  Get,
  Post,
  Delete,
  Controller,
  Body,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard())
  @Get()
  getPosts(@Req() req: any): Promise<PostModel[]> {
    console.log(req);
    return this.postService.findAll();
  }

  @UseGuards(AuthGuard())
  @Get('/:id')
  getPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Get('user/:id')
  async getPostByUser(@Param('id') id: string): Promise<PostModel[]> {
    return await this.postService.findByUser(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  async createPost(
    @Body('text') text: string,
    @Req() request: any,
  ): Promise<string> {
    try {
      const userId = request.user.dataValues.id;
      const post = await this.postService.add(text, userId);
      return `Post ${post.id} created.`;
    } catch (error) {
      return `Unable to Create Post: ${error}`;
    }
  }

  @UseGuards(AuthGuard())
  @Post('like')
  async submitLike(
    @Body('postId') postId: string,
    @Req() request: any,
  ): Promise<string> {
    try {
      const userId = request.user.dataValues.id;
      return this.postService.submitLike(userId, postId);
    } catch (error) {
      throw error;
    }
  }

  @Post('seedRandom')
  async seedRandom(@Body('postData') postData: string[]): Promise<PostModel[]> {
    return this.postService.seedRandom(postData);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Req() request: any,
  ): Promise<string> {
    const userId = request.user.dataValues.id;
    const postToDelete = await this.postService.findOne(id);
    if (postToDelete.userId == userId) {
      const postId = this.postService.remove(id);
      return postId;
    } else {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
  }
}
