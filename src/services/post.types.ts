import type { NewPost, Post } from "../domain/post/entity.js";

export interface PostService {
  getPosts(category?: string, take?: number): Post[];
  getPost(id: number): Post | undefined;
  createPost(data: NewPost): Promise<Post>;
}
