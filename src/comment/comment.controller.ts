import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.model';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getComments(): Promise<Comment[]> {
    return this.commentService.findAll();
  }
  @Get(':id')
  getComment(@Param('id') id: string): Promise<Comment> {
    return this.commentService.findOne(id);
  }
  @Post()
  async createComment(
    @Body('text') text: string,
    @Body('userId') userId: string,
    @Body('postId') postId: string,
  ): Promise<Comment> {
    try {
      const comment = await this.commentService.add(text, userId, postId);
      return comment;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Post('like')
  async submitLike(
    @Body('userId') userId: string,
    @Body('commentId') commentId: string,
  ): Promise<string> {
    try {
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
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<string> {
    const commentId = this.commentService.remove(id);
    return commentId;
  }
}
