import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateComment } from "@/entities/comment/api"

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: number; postId: number; body: string }) =>
      updateComment(variables.id, variables.body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}
