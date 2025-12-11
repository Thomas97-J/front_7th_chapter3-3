import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likeComment } from "@/entities/comment/api"

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: number; postId: number; currentLikes: number }) =>
      likeComment(variables.id, variables.currentLikes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}
