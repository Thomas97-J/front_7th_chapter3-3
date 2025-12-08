import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components"
import { HighlightedText } from "@/components/shared/HighlightedText"
import { CommentList } from "@/components/comments/CommentList"
import type { Post, Comment } from "@/types/api"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  comments: Comment[]
  searchQuery: string
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number, postId: number) => void
  onLikeComment: (id: number, postId: number) => void
}

export const PostDetailDialog: React.FC<PostDetailDialogProps> = ({
  open,
  onOpenChange,
  post,
  comments,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}) => {
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightedText text={post.title} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightedText text={post.body} highlight={searchQuery} />
          </p>
          {post.id && (
            <CommentList
              postId={post.id}
              comments={comments}
              searchQuery={searchQuery}
              onAddComment={onAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onLikeComment={onLikeComment}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

PostDetailDialog.displayName = "PostDetailDialog"
