declare const __API_BASE_URL__: string

import type { User } from "../model/types"

/**
 * 사용자 상세 정보 조회
 */
export const fetchUser = async (userId: number): Promise<User> => {
  const response = await fetch(`${__API_BASE_URL__}/users/${userId}`)
  return response.json()
}
