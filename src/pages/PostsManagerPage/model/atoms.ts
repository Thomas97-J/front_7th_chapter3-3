import { atom } from "jotai"
import type { Post } from "@/entities/post/model"
import type { Comment } from "@/entities/comment/model"
import type { User } from "@/entities/user/model"
import type { FilterState } from "./types"

/**
 * 필터/페이지네이션 상태 atom
 */
export const filterStateAtom = atom<FilterState>({
  skip: 0,
  limit: 10,
  searchQuery: "",
  selectedTag: "",
  sortBy: "",
  sortOrder: "asc",
})

/**
 * 선택된 항목 atoms
 */
export const selectedPostAtom = atom<Post | null>(null)
export const selectedCommentAtom = atom<Comment | null>(null)
export const selectedUserAtom = atom<User | null>(null)

/**
 * 다이얼로그 표시 상태 atoms
 */
export const showAddDialogAtom = atom<boolean>(false)
export const showEditDialogAtom = atom<boolean>(false)
export const showAddCommentDialogAtom = atom<boolean>(false)
export const showEditCommentDialogAtom = atom<boolean>(false)
export const showPostDetailDialogAtom = atom<boolean>(false)
export const showUserModalAtom = atom<boolean>(false)

/**
 * 로딩 상태 atom
 */
export const loadingAtom = atom<boolean>(false)
