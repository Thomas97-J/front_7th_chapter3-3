import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost } from "@/entities/post/api"
import type { Post } from "@/entities/post/model"

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) => updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
