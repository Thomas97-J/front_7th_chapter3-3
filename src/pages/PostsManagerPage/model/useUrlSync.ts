import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAtom } from "jotai"
import { filterStateAtom } from "@/store"
import type { SortByOption, SortOrderOption } from "./types"

/**
 * URL 쿼리 파라미터와 filterState atom을 동기화하는 hook
 *
 * - 초기 로드 시 URL → Atom
 * - 이후 Atom 변경 시 Atom → URL
 */
export const useUrlSync = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [filterState, setFilterState] = useAtom(filterStateAtom)
  const isInitialMount = useRef(true)

  // URL → Atom (초기 로드 시에만)
  useEffect(() => {
    if (isInitialMount.current) {
      const params = new URLSearchParams(location.search)
      setFilterState({
        skip: parseInt(params.get("skip") || "0", 10),
        limit: parseInt(params.get("limit") || "10", 10),
        searchQuery: params.get("search") || "",
        selectedTag: params.get("tag") || "",
        sortBy: (params.get("sortBy") as SortByOption) || "",
        sortOrder: (params.get("sortOrder") as SortOrderOption) || "asc",
      })
      isInitialMount.current = false
    }
  }, [location.search, setFilterState])

  // Atom → URL (filterState 변경 시)
  useEffect(() => {
    if (isInitialMount.current) return // 초기 마운트 시에는 URL 업데이트 안 함

    const params = new URLSearchParams()

    if (filterState.skip) params.set("skip", String(filterState.skip))
    if (filterState.limit !== 10) params.set("limit", String(filterState.limit))
    if (filterState.searchQuery) params.set("search", filterState.searchQuery)
    if (filterState.selectedTag) params.set("tag", filterState.selectedTag)
    if (filterState.sortBy) params.set("sortBy", filterState.sortBy)
    if (filterState.sortOrder !== "asc") params.set("sortOrder", filterState.sortOrder)

    const newSearch = params.toString()
    const currentSearch = location.search.replace(/^\?/, "")

    // URL이 실제로 변경된 경우에만 navigate 호출
    if (newSearch !== currentSearch) {
      navigate({ search: newSearch }, { replace: true })
    }
  }, [filterState, navigate, location.search])
}
