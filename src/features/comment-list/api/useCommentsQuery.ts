import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "@/entities/comment/api"

export const useCommentsQuery = (postId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: enabled && !!postId,
  })
}
