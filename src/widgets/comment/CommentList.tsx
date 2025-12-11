import { useAtom } from "jotai"
import { Button } from "@/shared/ui"
import { Plus, ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { HighlightedText } from "@/shared/ui/HighlightedText"
import { useCommentsQuery } from "@/features/comment-list"
import { filterStateAtom } from "@/pages/PostsManagerPage/model/atoms"
import type { Comment } from "@/entities/comment/model"

interface CommentListProps {
  postId: number
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number, postId: number) => void
  onLikeComment: (id: number, postId: number) => void
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}) => {
  const { data: comments = [], isLoading } = useCommentsQuery(postId)
  const [filterState] = useAtom(filterStateAtom)

  if (isLoading) {
    return <div className="mt-2 text-sm text-center">댓글 로딩 중...</div>
  }

  return (
    <div className="mt-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => onAddComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-1">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            {/* 댓글 내용 */}
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">
                <HighlightedText text={comment.body} highlight={filterState.searchQuery} />
              </span>
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onLikeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

CommentList.displayName = "CommentList"
