import type { Comment } from "@/types/api"

/**
 * 특정 게시물의 댓글 목록 조회
 */
export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  const data: { comments: Comment[] } = await response.json()
  return data.comments
}

/**
 * 댓글 생성
 */
export const createComment = async (commentData: {
  body: string
  postId: number
  userId: number
}): Promise<Comment> => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  })
  return response.json()
}

/**
 * 댓글 수정
 */
export const updateComment = async (id: number, body: string): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  })
  return response.json()
}

/**
 * 댓글 삭제
 */
export const deleteComment = async (id: number): Promise<void> => {
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
}

/**
 * 댓글 좋아요
 */
export const likeComment = async (id: number, currentLikes: number): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  })
  return response.json()
}
