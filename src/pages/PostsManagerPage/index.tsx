import { useAtom } from "jotai"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"

import { useUrlSync } from "./model"
// TanStack Query
import { usePostsQuery } from "@/features/post-list"
import { usePostsByTagQuery } from "@/features/post-filter"
import { useSearchPostsQuery } from "@/features/post-search"

// Page atoms
import {
  filterStateAtom,
  selectedCommentAtom,
  selectedPostAtom,
  selectedUserAtom,
  showAddCommentDialogAtom,
  showAddDialogAtom,
  showEditCommentDialogAtom,
  showEditDialogAtom,
  showPostDetailDialogAtom,
  showUserModalAtom,
} from "./model/atoms"
import {
  createPost,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
} from "@/entities/post/api"
import {
  createComment,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
  likeComment as likeCommentApi,
} from "@/entities/comment/api"
import { fetchUser } from "@/entities/user/api"
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

  const postsQuery = usePostsQuery(
    filterState.skip,
    filterState.limit,
    !isSearching && !isFiltering
  )

  const searchQuery = useSearchPostsQuery(
    filterState.searchQuery,
    isSearching
  )

  const tagQuery = usePostsByTagQuery(
    filterState.selectedTag,
    isFiltering
  )

  // 활성화된 쿼리의 데이터 사용
  const activeQuery = isSearching ? searchQuery : isFiltering ? tagQuery : postsQuery
  const posts = activeQuery.data?.posts ?? []
  const total = activeQuery.data?.total ?? 0
  const loading = activeQuery.isLoading

  // Selection Atoms
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom)

  // Dialog Atoms
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)

  // Add post
  const handleAddPost = async (postData: { title: string; body: string; userId: number }): Promise<void> => {
    try {
      const newPost = await createPost(postData)
      setPosts([newPost, ...posts])
      setShowAddDialog(false)
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // Update post
  const handleUpdatePost = async (postData: { title: string; body: string; userId: number }): Promise<void> => {
    if (!selectedPost) return
    try {
      const updatedPost = await updatePostApi(selectedPost.id, postData)
      setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // Delete post
  const handleDeletePost = async (id: number): Promise<void> => {
    try {
      await deletePostApi(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // Add comment
  const handleAddComment = async (commentData: { body: string }): Promise<void> => {
    if (!selectedPost?.id) return
    try {
      await createComment({
        body: commentData.body,
        postId: selectedPost.id,
        userId: 1,
      })
      setShowAddCommentDialog(false)
      // TODO: Phase 5에서 mutation으로 교체하여 자동 invalidation 처리
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // Update comment
  const handleUpdateComment = async (commentData: { body: string }): Promise<void> => {
    if (!selectedComment) return
    try {
      await updateCommentApi(selectedComment.id, commentData.body)
      setShowEditCommentDialog(false)
      // TODO: Phase 5에서 mutation으로 교체하여 자동 invalidation 처리
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // Delete comment
  const handleDeleteComment = async (id: number, _postId: number): Promise<void> => {
    try {
      await deleteCommentApi(id)
      // TODO: Phase 5에서 mutation으로 교체하여 자동 invalidation 처리
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // Like comment
  const handleLikeComment = async (id: number, _postId: number): Promise<void> => {
    try {
      // TODO: Phase 5에서 현재 likes를 쿼리에서 가져와서 처리
      await likeCommentApi(id, 0) // 임시: 0으로 전달
      // TODO: Phase 5에서 mutation으로 교체하여 자동 invalidation 처리
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // Open post detail
  const handleOpenPostDetail = (post: Post): void => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
    // 댓글은 CommentList에서 useCommentsQuery로 자동 로드됨
  }

  // Open user modal
  const handleOpenUserModal = async (user: User): Promise<void> => {
    try {
      const userData = await fetchUser(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
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
      <UserInfoModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
