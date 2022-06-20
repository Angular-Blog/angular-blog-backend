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
import { CommentService } from './comment.service';
import { Comment } from './comment.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard())
  @Get()
  getComments(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  getComment(@Param('id') id: string): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  async createComment(
    @Body('text') text: string,
    @Body('postId') postId: string,
    @Req() request: any,
  ): Promise<Comment> {
    try {
      const userId = request.user.dataValues.id;
      const comment = await this.commentService.add(text, userId, postId);
      return comment;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard())
  @Post('like')
  async submitLike(
    @Body('commentId') commentId: string,
    @Req() request: any,
  ): Promise<string> {
    try {
      const userId = request.user.dataValues.id;
      return this.commentService.submitLike(userId, commentId);
    } catch (error) {
      throw error;
    }
  }

  @Post('seedRandom')
  async seedRandom(
    @Body('commentData') commentData: string[],
  ): Promise<Comment[]> {
    return this.commentService.seedRandom(commentData);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Req() request: any,
  ): Promise<string> {
    const userId = request.user.dataValues.id;
    const commentToDelete = await this.commentService.findOne(id);
    if (commentToDelete.userId == userId) {
      const commentId = this.commentService.remove(id);
      return commentId;
    } else {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
  }
}
