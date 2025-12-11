import { atom } from "jotai"
import type { Post } from "./types"

/**
 * 게시물 목록 atom
 */
export const postsAtom = atom<Post[]>([])

/**
 * 전체 게시물 수 atom (페이지네이션용)
 */
export const totalAtom = atom<number>(0)
