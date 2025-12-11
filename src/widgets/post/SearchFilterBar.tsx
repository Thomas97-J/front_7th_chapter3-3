import { Search } from "lucide-react"
import { useAtom } from "jotai"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { filterStateAtom } from "@/pages/PostsManagerPage/model/atoms"
import type { SortByOption, SortOrderOption } from "@/pages/PostsManagerPage/model/types"
import { useTagsQuery } from "@/features/tag-list"

export const SearchFilterBar: React.FC = () => {
  const [filterState, setFilterState] = useAtom(filterStateAtom)
  const { data: tags = [] } = useTagsQuery()

  return (
    <div className="flex gap-4">
      {/* 검색 입력 */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={filterState.searchQuery}
            onChange={(e) => setFilterState({ ...filterState, searchQuery: e.target.value })}
          />
        </div>
      </div>

      {/* 태그 선택 */}
      <Select
        value={filterState.selectedTag}
        onValueChange={(tag) => setFilterState({ ...filterState, selectedTag: tag })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 정렬 기준 */}
      <Select
        value={filterState.sortBy}
        onValueChange={(value) => setFilterState({ ...filterState, sortBy: value as SortByOption })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>

      {/* 정렬 순서 */}
      <Select
        value={filterState.sortOrder}
        onValueChange={(value) => setFilterState({ ...filterState, sortOrder: value as SortOrderOption })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

SearchFilterBar.displayName = "SearchFilterBar"
