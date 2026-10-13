import type { Request, Response } from "express";
import type { PostService } from "../../services/post.types.js";
import type { Post } from "../../domain/post/entity.js";
import type {
  CreatePostDto,
  GetPostsQueryDto,
  PostResponseDto,
} from "../../dto/post.dto.js";

type ErrorResponse = { message: string };

export interface PostHandlers {
  getPosts(
    req: Request<{}, {}, {}, GetPostsQueryDto>,
    res: Response<PostResponseDto[] | ErrorResponse>
  ): void;
  getPostById(
    req: Request<{ id: string }>,
    res: Response<PostResponseDto | ErrorResponse>
  ): void;
  createPost(
    req: Request<{}, {}, CreatePostDto>,
    res: Response<PostResponseDto | ErrorResponse>
  ): Promise<void>;
}

function toResponse(post: Post): PostResponseDto {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author,
    category: post.category,
  };
}

export function createPostHandlers(service: PostService): PostHandlers {
  return {
    getPosts(req, res) {
      const { category } = req.query;
      let take: number | undefined;

      if (req.query.take !== undefined) {
        take = Number(req.query.take);
        if (!Number.isInteger(take) || take <= 0) {
          res.status(400).json({ message: "take must be a positive integer" });
          return;
        }
      }

      const posts = service.getPosts(category, take);
      res.json(posts.map(toResponse));
    },

    getPostById(req, res) {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: "id must be a positive integer" });
        return;
      }

      const post = service.getPost(id);

      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      res.json(toResponse(post));
    },

    async createPost(req, res) {
      const { title, content, author, category } = req.body ?? {};

      if (!title || !content) {
        res.status(422).json({ message: "title and content are required" });
        return;
      }

      try {
        const post = await service.createPost({
          title,
          content,
          author: author || "anonymous",
          category: category || "general",
        });
        res.status(201).json(toResponse(post));
      } catch (err) {
        res.status(500).json({ message: "Failed to create post" });
      }
    },
  };
}
