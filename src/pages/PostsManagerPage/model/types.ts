// 정렬 옵션
export type SortByOption = "" | "none" | "id" | "title" | "reactions"
export type SortOrderOption = "asc" | "desc"
export type PageLimit = 10 | 20 | 30

export const PAGE_LIMITS: PageLimit[] = [10, 20, 30]

// 상태 타입
export interface NewPostState {
  title: string
  body: string
  userId: number
}

export interface NewCommentState {
  body: string
  postId: number | null
  userId: number
}

export interface SearchState {
  query: string
  selectedTag: string
  sortBy: SortByOption
  sortOrder: SortOrderOption
}
