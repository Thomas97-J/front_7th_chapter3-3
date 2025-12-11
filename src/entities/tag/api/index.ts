declare const __API_BASE_URL__: string

import type { Tag } from "../model/types"

/**
 * 태그 목록 조회
 */
export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${__API_BASE_URL__}/posts/tags`)
  return response.json()
}
