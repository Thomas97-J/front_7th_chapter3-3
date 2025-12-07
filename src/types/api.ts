// 도메인 엔티티 타입
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

export interface User {
  id: number
  username: string
  image: string
  firstName?: string
  lastName?: string
  age?: number
  email?: string
  phone?: string
  address?: {
    address: string
    city: string
    state: string
  }
  company?: {
    name: string
    title: string
  }
}

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user: {
    id: number
    username: string
  }
  likes: number
}

export interface Tag {
  slug: string
  url: string
}

// API 응답 타입
export interface PostsApiResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export interface UsersApiResponse {
  users: User[]
  total: number
}

export interface CommentsApiResponse {
  comments: Comment[]
  total: number
}

export type TagsApiResponse = Tag[]

// API 요청 타입
export interface CreatePostRequest {
  title: string
  body: string
  userId: number
}

export interface UpdatePostRequest {
  title?: string
  body?: string
}

export interface CreateCommentRequest {
  body: string
  postId: number
  userId: number
}

export interface UpdateCommentRequest {
  body?: string
  likes?: number
}
