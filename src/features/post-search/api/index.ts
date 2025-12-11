import type { Post } from "@/entities/post/model"
import type { PostsApiResponse } from "@/entities/post/model"

/**
 * 게시물 검색
 */
export const searchPosts = async (query: string): Promise<{ posts: Post[]; total: number }> => {
  const response = await fetch(`/api/posts/search?q=${query}`)
  const data: PostsApiResponse = await response.json()

  return {
    posts: data.posts,
    total: data.total,
  }
}
