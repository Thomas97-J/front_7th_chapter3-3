import { atom } from "jotai"
import type { SortByOption, SortOrderOption } from "@/types/state"

export interface FilterState {
  skip: number
  limit: number
  searchQuery: string
  selectedTag: string
  sortBy: SortByOption
  sortOrder: SortOrderOption
}

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
