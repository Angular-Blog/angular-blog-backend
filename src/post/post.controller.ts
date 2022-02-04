import * as nest from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './post.model';

@nest.Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @nest.Get()
  getPosts(): Promise<Post[]> {
    return this.postService.findAll();
  }
  @nest.Get(':id')
  getPost(@nest.Param('id') id: string): Promise<Post> {
    return this.postService.findOne(id);
  }
  @nest.Post()
  async createPost(
    @nest.Body('text') text: string,
    @nest.Body('userId') userId: string,
  ): Promise<string> {
    try {
      const post = await this.postService.add(text, userId);
      return `Post ${post.id} created.`;
    } catch (error) {
      return `Unable to Create Post: ${error}`;
    }
  }
  @nest.Delete(':id')
  deletePost(@nest.Param('id') id: string): Promise<string> {
    const postId = this.postService.remove(id);
    return postId;
  }
}
