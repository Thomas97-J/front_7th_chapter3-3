import { atom } from "jotai"
import type { Post, Tag, Comment } from "@/types/api"
import type { CommentsState } from "@/types/state"

/**
 * 게시물 목록 atom
 */
export const postsAtom = atom<Post[]>([])

/**
 * 전체 게시물 수 atom (페이지네이션용)
 */
export const totalAtom = atom<number>(0)

/**
 * 댓글 상태 atom (postId를 key로 하는 Record)
 */
export const commentsAtom = atom<CommentsState>({})

/**
 * 태그 목록 atom
 */
export const tagsAtom = atom<Tag[]>([])
