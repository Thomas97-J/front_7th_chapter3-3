import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteComment } from "@/entities/comment/api"

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: number; postId: number }) => deleteComment(variables.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}
