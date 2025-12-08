import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@/components"
import type { Post } from "@/types/api"

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialData?: Post | null
  onSubmit: () => void
  title: string
  body: string
  userId?: number
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  onUserIdChange?: (userId: number) => void
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  onSubmit,
  title,
  body,
  userId,
  onTitleChange,
  onBodyChange,
  onUserIdChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "새 게시물 추가" : "게시물 수정"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={title} onChange={(e) => onTitleChange(e.target.value)} />
          <Textarea
            rows={mode === "create" ? 30 : 15}
            placeholder="내용"
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
          />
          {mode === "create" && onUserIdChange && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={userId || ""}
              onChange={(e) => onUserIdChange(Number(e.target.value))}
            />
          )}
          <Button onClick={onSubmit}>{mode === "create" ? "게시물 추가" : "게시물 업데이트"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

PostFormDialog.displayName = "PostFormDialog"
