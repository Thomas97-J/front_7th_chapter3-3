import type { Post, User, PostsApiResponse, UsersApiResponse } from "@/types/api"

/**
 * 게시물 목록 조회 (사용자 정보 포함)
 */
export const fetchPosts = async (limit: number, skip: number): Promise<{ posts: Post[]; total: number }> => {
  const postsResponse = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  const postsData: PostsApiResponse = await postsResponse.json()

  const usersResponse = await fetch("/api/users?limit=0&select=username,image")
  const usersData: UsersApiResponse = await usersResponse.json()

  const postsWithUsers: Post[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((user) => user.id === post.userId),
  }))

  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}

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

/**
 * 태그별 게시물 조회
 */
export const fetchPostsByTag = async (tag: string): Promise<{ posts: Post[]; total: number }> => {
  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`/api/posts/tag/${tag}`),
    fetch("/api/users?limit=0&select=username,image"),
  ])

  const postsData: PostsApiResponse = await postsResponse.json()
  const usersData: UsersApiResponse = await usersResponse.json()

  const postsWithUsers: Post[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((user) => user.id === post.userId),
  }))

  return {
    posts: postsWithUsers,
    total: postsData.total,
  }
}

/**
 * 게시물 생성
 */
export const createPost = async (postData: { title: string; body: string; userId: number }): Promise<Post> => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  return response.json()
}

/**
 * 게시물 수정
 */
export const updatePost = async (id: number, postData: Partial<Post>): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
  return response.json()
}

/**
 * 게시물 삭제
 */
export const deletePost = async (id: number): Promise<void> => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
}
