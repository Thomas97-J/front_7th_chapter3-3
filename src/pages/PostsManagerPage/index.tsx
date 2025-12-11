import { useAtom } from "jotai"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"

import { useUrlSync } from "./model"
// TanStack Query
import { usePostsQuery } from "@/features/post-list"
import { usePostsByTagQuery } from "@/features/post-filter"
import { useSearchPostsQuery } from "@/features/post-search"
import { useCreatePostMutation } from "@/features/post-create"
import { useUpdatePostMutation } from "@/features/post-update"
import { useDeletePostMutation } from "@/features/post-delete"
import { useCreateCommentMutation } from "@/features/comment-create"
import { useUpdateCommentMutation } from "@/features/comment-update"
import { useDeleteCommentMutation } from "@/features/comment-delete"
import { useLikeCommentMutation } from "@/features/comment-like"
import { useUserQuery } from "@/features/user-detail"

// Page atoms
import {
  filterStateAtom,
  selectedCommentAtom,
  selectedPostAtom,
  selectedUserIdAtom,
  showAddCommentDialogAtom,
  showAddDialogAtom,
  showEditCommentDialogAtom,
  showEditDialogAtom,
  showPostDetailDialogAtom,
  showUserModalAtom,
} from "./model/atoms"
import type { Post } from "@/entities/post/model"
import type { User } from "@/entities/user/model"
import { SearchFilterBar } from "@/widgets/post/SearchFilterBar"
import { PostTable } from "@/widgets/post/PostTable"
import { Pagination } from "@/widgets/post/Pagination"
import { PostFormDialog } from "@/widgets/post/PostFormDialog"
import { CommentFormDialog } from "@/widgets/comment/CommentFormDialog"
import { PostDetailDialog } from "@/widgets/post/PostDetailDialog"
import { UserInfoModal } from "@/widgets/user/UserInfoModal"

const PostsManager = () => {
  // URL 동기화
  useUrlSync()

  // Filter State
  const [filterState, setFilterState] = useAtom(filterStateAtom)

  // TanStack Query - 조건에 따라 다른 쿼리 사용
  const isSearching = !!filterState.searchQuery
  const isFiltering = !!filterState.selectedTag && !isSearching

  const postsQuery = usePostsQuery(filterState.skip, filterState.limit, !isSearching && !isFiltering)

  const searchQuery = useSearchPostsQuery(filterState.searchQuery, isSearching)

  const tagQuery = usePostsByTagQuery(filterState.selectedTag, isFiltering)

  // 활성화된 쿼리의 데이터 사용
  const activeQuery = isSearching ? searchQuery : isFiltering ? tagQuery : postsQuery
  const posts = activeQuery.data?.posts ?? []
  const total = activeQuery.data?.total ?? 0
  const loading = activeQuery.isLoading

  // Mutations
  const createPostMutation = useCreatePostMutation()
  const updatePostMutation = useUpdatePostMutation()
  const deletePostMutation = useDeletePostMutation()
  const createCommentMutation = useCreateCommentMutation()
  const updateCommentMutation = useUpdateCommentMutation()
  const deleteCommentMutation = useDeleteCommentMutation()
  const likeCommentMutation = useLikeCommentMutation()

  // Selection Atoms
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom)

  // User Query
  const userQuery = useUserQuery(selectedUserId)

  // Dialog Atoms
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)

  // Add post
  const handleAddPost = (postData: { title: string; body: string; userId: number }): void => {
    createPostMutation.mutate(postData, {
      onSuccess: () => {
        setShowAddDialog(false)
      },
    })
  }

  // Update post
  const handleUpdatePost = (postData: { title: string; body: string; userId: number }): void => {
    if (!selectedPost) return
    updatePostMutation.mutate(
      {
        id: selectedPost.id,
        data: postData,
      },
      {
        onSuccess: () => {
          setShowEditDialog(false)
        },
      },
    )
  }

  // Delete post
  const handleDeletePost = (id: number): void => {
    deletePostMutation.mutate(id)
  }

  // Add comment
  const handleAddComment = (commentData: { body: string }): void => {
    if (!selectedPost?.id) return
    createCommentMutation.mutate(
      {
        body: commentData.body,
        postId: selectedPost.id,
        userId: 1,
      },
      {
        onSuccess: () => {
          setShowAddCommentDialog(false)
        },
      },
    )
  }

  // Update comment
  const handleUpdateComment = (commentData: { body: string }): void => {
    if (!selectedComment || !selectedPost) return
    updateCommentMutation.mutate(
      {
        id: selectedComment.id,
        postId: selectedPost.id,
        body: commentData.body,
      },
      {
        onSuccess: () => {
          setShowEditCommentDialog(false)
        },
      },
    )
  }

  // Delete comment
  const handleDeleteComment = (id: number, postId: number): void => {
    deleteCommentMutation.mutate({ id, postId })
  }

  // Like comment
  const handleLikeComment = (id: number, postId: number, currentLikes: number): void => {
    likeCommentMutation.mutate({ id, postId, currentLikes })
  }

  // Open post detail
  const handleOpenPostDetail = (post: Post): void => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
    // 댓글은 CommentList에서 useCommentsQuery로 자동 로드됨
  }

  // Open user modal
  const handleOpenUserModal = (user: User): void => {
    setSelectedUserId(user.id)
    setShowUserModal(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchFilterBar />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              onTagClick={(tag) => {
                setFilterState({ ...filterState, selectedTag: tag })
              }}
              onUserClick={handleOpenUserModal}
              onViewDetail={handleOpenPostDetail}
              onEdit={(post) => {
                setSelectedPost(post)
                setShowEditDialog(true)
              }}
              onDelete={handleDeletePost}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination total={total} />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostFormDialog open={showAddDialog} onOpenChange={setShowAddDialog} mode="create" onSubmit={handleAddPost} />

      {/* 게시물 수정 대화상자 */}
      <PostFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        mode="edit"
        initialData={selectedPost}
        onSubmit={handleUpdatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentFormDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        mode="create"
        onSubmit={handleAddComment}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentFormDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        mode="edit"
        initialData={selectedComment}
        onSubmit={handleUpdateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        onAddComment={(postId) => {
          setSelectedPost(posts.find((p) => p.id === postId) || null)
          setShowAddCommentDialog(true)
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLikeComment}
      />

      {/* 사용자 모달 */}
      <UserInfoModal
        open={showUserModal}
        onOpenChange={(open) => {
          setShowUserModal(open)
          if (!open) setSelectedUserId(null)
        }}
        user={userQuery.data ?? null}
        isLoading={userQuery.isLoading}
      />
    </Card>
  )
}

export default PostsManager
