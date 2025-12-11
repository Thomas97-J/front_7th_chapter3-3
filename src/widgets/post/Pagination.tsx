import { useAtom } from "jotai"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { totalAtom } from "@/entities/post/model"
import { filterStateAtom } from "@/pages/PostsManagerPage/model/atoms"

export const Pagination: React.FC = () => {
  const [filterState, setFilterState] = useAtom(filterStateAtom)
  const [total] = useAtom(totalAtom)

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setFilterState({ ...filterState, skip: Math.max(0, filterState.skip - filterState.limit) })
    } else {
      setFilterState({ ...filterState, skip: filterState.skip + filterState.limit })
    }
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          value={filterState.limit.toString()}
          onValueChange={(value) => setFilterState({ ...filterState, limit: Number(value), skip: 0 })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>

      <div className="flex items-center gap-2">
        <Button disabled={filterState.skip === 0} onClick={() => handlePageChange("prev")}>
          이전
        </Button>
        <span>
          {filterState.skip + 1}-{Math.min(filterState.skip + filterState.limit, total)} / {total}
        </span>
        <Button disabled={filterState.skip + filterState.limit >= total} onClick={() => handlePageChange("next")}>
          다음
        </Button>
      </div>
    </div>
  )
}

Pagination.displayName = "Pagination"
