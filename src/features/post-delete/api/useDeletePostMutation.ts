import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "@/entities/post/api"

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
