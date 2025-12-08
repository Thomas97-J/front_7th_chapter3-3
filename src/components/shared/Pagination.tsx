import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"

interface PaginationProps {
  limit: number
  onLimitChange: (limit: number) => void
  skip: number
  total: number
  onPageChange: (direction: "prev" | "next") => void
}

export const Pagination: React.FC<PaginationProps> = ({ limit, onLimitChange, skip, total, onPageChange }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
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
        <Button disabled={skip === 0} onClick={() => onPageChange("prev")}>
          이전
        </Button>
        <span>
          {skip + 1}-{Math.min(skip + limit, total)} / {total}
        </span>
        <Button disabled={skip + limit >= total} onClick={() => onPageChange("next")}>
          다음
        </Button>
      </div>
    </div>
  )
}

Pagination.displayName = "Pagination"
