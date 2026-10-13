import type { NewPost, Post } from "./entity.js";

export interface Repository {
  getAll(category?: string, take?: number): Post[];
  getById(id: number): Post | undefined;
  create(data: NewPost): Promise<Post>;
}
