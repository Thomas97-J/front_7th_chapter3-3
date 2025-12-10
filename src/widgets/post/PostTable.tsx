import { useAtom } from "jotai"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@/shared/ui"
import { MessageSquare, Edit2, Trash2, ThumbsUp, ThumbsDown } from "lucide-react"
import { HighlightedText } from "@/shared/ui/HighlightedText"
import { postsAtom, filterStateAtom } from "@/store"
import type { Post, User } from "@/types/api"

interface PostTableProps {
  onTagClick: (tag: string) => void
  onUserClick: (user: User) => void
  onViewDetail: (post: Post) => void
  onEdit: (post: Post) => void
  onDelete: (id: number) => void
}

export const PostTable: React.FC<PostTableProps> = ({ onTagClick, onUserClick, onViewDetail, onEdit, onDelete }) => {
  const [posts] = useAtom(postsAtom)
  const [filterState] = useAtom(filterStateAtom)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>

            {/* 제목 + 태그 */}
            <TableCell>
              <div className="space-y-1">
                <div>
                  <HighlightedText text={post.title} highlight={filterState.searchQuery} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer bg-slate-100 text-slate-800 hover:bg-slate-200"
                      onClick={() => onTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>

            {/* 작성자 */}
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => post.author && onUserClick(post.author)}
              >
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>

            {/* 반응 */}
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>

            {/* 작업 */}
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onViewDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

PostTable.displayName = "PostTable"
