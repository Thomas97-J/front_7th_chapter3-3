import type { Comment } from "@/entities/comment/model"

export type CommentsState = Record<number, Comment[]>
