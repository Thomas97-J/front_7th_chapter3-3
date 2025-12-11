import { useQuery } from "@tanstack/react-query"
import { fetchPosts } from "@/entities/post/api"

export const usePostsQuery = (skip: number, limit: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["posts", { skip, limit }],
    queryFn: () => fetchPosts(limit, skip),
    enabled,
  })
}
