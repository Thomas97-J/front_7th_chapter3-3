import { atom } from "jotai"
import type { Post, User, Comment } from "@/types/api"

/**
 * 선택된 항목 atoms
 */
export const selectedPostAtom = atom<Post | null>(null)
export const selectedCommentAtom = atom<Comment | null>(null)
export const selectedUserAtom = atom<User | null>(null)
