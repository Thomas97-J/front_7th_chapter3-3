import { useQuery } from "@tanstack/react-query"
import { fetchUser } from "@/entities/user/api"

export const useUserQuery = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: userId !== null,
  })
}
