import type { User } from "@/entities/user/model"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: User
}

export interface PostsApiResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}
