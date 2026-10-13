import type { Post } from "../domain/post/entity.js";
import type { Repository } from "../domain/post/repository.js";

export function createPostRepository(): Repository {
  const posts: Post[] = [
    { id: 1, title: "Intro to Node.js", content: "Node is a JS runtime", author: "alex", category: "programming" },
    { id: 2, title: "Express basics", content: "Routers and handlers", author: "maria", category: "programming" },
    { id: 3, title: "Best movies 2025", content: "My top list", author: "ivan", category: "movies" },
    { id: 4, title: "Football results", content: "Weekend recap", author: "olga", category: "sport" },
  ];

  let nextId = 5;

  return {
    getAll(category, take) {
      let result = posts;

      if (category) {
        result = result.filter(
          (post) => post.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (take) {
        result = result.slice(0, take);
      }

      return result;
    },

    getById(id) {
      return posts.find((post) => post.id === id);
    },

    create(data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const post: Post = { id: nextId++, ...data };
          posts.push(post);
          resolve(post);
        }, 200);
      });
    },
  };
}
