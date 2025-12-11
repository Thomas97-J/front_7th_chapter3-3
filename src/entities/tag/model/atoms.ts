import { atom } from "jotai"
import type { Tag } from "./types"

/**
 * 태그 목록 atom
 */
export const tagsAtom = atom<Tag[]>([])
