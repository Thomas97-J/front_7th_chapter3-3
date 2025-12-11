import { useQuery } from "@tanstack/react-query"
import { fetchTags } from "@/entities/tag/api"

export const useTagsQuery = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity, // 정적 데이터, 한 번만 로드
  })
}
