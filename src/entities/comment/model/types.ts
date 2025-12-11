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

export interface CommentsApiResponse {
  comments: Comment[]
  total: number
}
