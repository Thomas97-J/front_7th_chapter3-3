import type { User } from "@/types/api"

/**
 * 사용자 상세 정보 조회
 */
export const fetchUser = async (userId: number): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
}
