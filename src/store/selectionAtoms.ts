import { atom } from "jotai"
import type { Post } from "@/entities/post/model"
import type { Comment } from "@/entities/comment/model"
import type { User } from "@/entities/user/model"

/**
 * 선택된 항목 atoms
 */
export const selectedPostAtom = atom<Post | null>(null)
export const selectedCommentAtom = atom<Comment | null>(null)
export const selectedUserAtom = atom<User | null>(null)
