import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "@/shared/ui"
import type { Post } from "@/types/api"

interface PostFormData {
  title: string
  body: string
  userId: number
}

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialData?: Post | null
  onSubmit: (data: PostFormData) => void
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({ open, onOpenChange, mode, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    body: "",
    userId: 1,
  })

  // initialData가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title,
        body: initialData.body,
        userId: initialData.userId,
      })
    } else if (mode === "create") {
      setFormData({
        title: "",
        body: "",
        userId: 1,
      })
    }
  }, [mode, initialData, open])

  const handleSubmit = () => {
    onSubmit(formData)
    // 폼 초기화 (create 모드일 때만)
    if (mode === "create") {
      setFormData({
        title: "",
        body: "",
        userId: 1,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "새 게시물 추가" : "게시물 수정"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            rows={mode === "create" ? 30 : 15}
            placeholder="내용"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
          {mode === "create" && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
            />
          )}
          <Button onClick={handleSubmit}>{mode === "create" ? "게시물 추가" : "게시물 업데이트"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

PostFormDialog.displayName = "PostFormDialog"
