import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createComment } from "@/entities/comment/api"

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}
