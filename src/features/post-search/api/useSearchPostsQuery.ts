import { useQuery } from "@tanstack/react-query"
import { searchPosts } from "./index"

export const useSearchPostsQuery = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["posts", "search", query],
    queryFn: () => searchPosts(query),
    enabled,
  })
}
