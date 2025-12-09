import type { Tag } from "@/types/api"

/**
 * 태그 목록 조회
 */
export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch("/api/posts/tags")
  return response.json()
}
