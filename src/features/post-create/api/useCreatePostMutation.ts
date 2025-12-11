import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost } from "@/entities/post/api"

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
