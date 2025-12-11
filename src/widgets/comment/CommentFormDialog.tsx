import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import type { Comment } from "@/entities/comment/model"

interface CommentFormData {
  body: string
}

interface CommentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialData?: Comment | null
  onSubmit: (data: CommentFormData) => void
}

export const CommentFormDialog: React.FC<CommentFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    body: "",
  })

  // initialData가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        body: initialData.body,
      })
    } else if (mode === "create") {
      setFormData({
        body: "",
      })
    }
  }, [mode, initialData, open])

  const handleSubmit = () => {
    onSubmit(formData)
    // 폼 초기화 (create 모드일 때만)
    if (mode === "create") {
      setFormData({
        body: "",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "새 댓글 추가" : "댓글 수정"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
          <Button onClick={handleSubmit}>{mode === "create" ? "댓글 추가" : "댓글 업데이트"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

CommentFormDialog.displayName = "CommentFormDialog"
