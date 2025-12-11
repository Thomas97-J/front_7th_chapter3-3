import { useQuery } from "@tanstack/react-query"
import { fetchPostsByTag } from "@/entities/post/api"

export const usePostsByTagQuery = (tag: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["posts", "tag", tag],
    queryFn: () => fetchPostsByTag(tag),
    enabled,
  })
}
