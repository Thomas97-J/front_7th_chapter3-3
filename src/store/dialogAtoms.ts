import { atom } from "jotai"

/**
 * 다이얼로그 표시 상태 atoms
 */
export const showAddDialogAtom = atom<boolean>(false)
export const showEditDialogAtom = atom<boolean>(false)
export const showAddCommentDialogAtom = atom<boolean>(false)
export const showEditCommentDialogAtom = atom<boolean>(false)
export const showPostDetailDialogAtom = atom<boolean>(false)
export const showUserModalAtom = atom<boolean>(false)
