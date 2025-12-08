import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/components"

interface CommentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  value: string
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export const CommentFormDialog: React.FC<CommentFormDialogProps> = ({
  open,
  onOpenChange,
  mode,
  value,
  onValueChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "새 댓글 추가" : "댓글 수정"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={value} onChange={(e) => onValueChange(e.target.value)} />
          <Button onClick={onSubmit}>{mode === "create" ? "댓글 추가" : "댓글 업데이트"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

CommentFormDialog.displayName = "CommentFormDialog"
