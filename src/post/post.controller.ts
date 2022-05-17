import {
  Get,
  Post,
  Delete,
  Controller,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(AuthGuard())
  getPosts(@Req() req: any): Promise<PostModel[]> {
    console.log(req);
    return this.postService.findAll();
  }
  @Get(':id')
  getPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.findOne(id);
  }
  @Post()
  async createPost(
    @Body('text') text: string,
    @Body('userId') userId: string,
  ): Promise<string> {
    try {
      const post = await this.postService.add(text, userId);
      return `Post ${post.id} created.`;
    } catch (error) {
      return `Unable to Create Post: ${error}`;
    }
  }
  @Post('like')
  async submitLike(
    @Body('userId') userId: string,
    @Body('postId') postId: string,
  ): Promise<string> {
    try {
      return this.postService.submitLike(userId, postId);
    } catch (error) {
      throw error;
    }
  }
  @Post('seedRandom')
  async seedRandom(@Body('postData') postData: string[]): Promise<PostModel[]> {
    return this.postService.seedRandom(postData);
  }
  @Delete(':id')
  deletePost(@Param('id') id: string): Promise<string> {
    const postId = this.postService.remove(id);
    return postId;
  }
}
