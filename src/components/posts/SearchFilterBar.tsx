import { Search } from "lucide-react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"
import type { Tag, SortByOption, SortOrderOption } from "@/types/state"

interface SearchFilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  tags: Tag[]
  selectedTag: string
  onTagChange: (tag: string) => void
  sortBy: SortByOption
  onSortByChange: (value: SortByOption) => void
  sortOrder: SortOrderOption
  onSortOrderChange: (value: SortOrderOption) => void
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  tags,
  selectedTag,
  onTagChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="flex gap-4">
      {/* 검색 입력 */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* 태그 선택 */}
      <Select value={selectedTag} onValueChange={onTagChange}>
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
      <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortByOption)}>
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
      <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as SortOrderOption)}>
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
