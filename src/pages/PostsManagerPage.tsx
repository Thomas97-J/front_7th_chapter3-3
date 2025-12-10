import { useEffect } from "react"
import { useAtom, useSetAtom } from "jotai"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { SearchFilterBar } from "../widgets/post/SearchFilterBar"
import { PostTable } from "../widgets/post/PostTable"
import { PostFormDialog } from "../widgets/post/PostFormDialog"
import { PostDetailDialog } from "../widgets/post/PostDetailDialog"
import { CommentFormDialog } from "../widgets/comment/CommentFormDialog"
import { UserInfoModal } from "../widgets/user/UserInfoModal"
import { Pagination } from "../widgets/post/Pagination"
import { useUrlSync } from "../hooks/useUrlSync"
import {
  postsAtom,
  totalAtom,
  filterStateAtom,
  commentsAtom,
  tagsAtom,
  loadingAtom,
  selectedPostAtom,
  selectedCommentAtom,
  selectedUserAtom,
  showAddDialogAtom,
  showEditDialogAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  showPostDetailDialogAtom,
  showUserModalAtom,
} from "../store"
import {
  fetchPosts,
  searchPosts as searchPostsApi,
  fetchPostsByTag as fetchPostsByTagApi,
  createPost,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
} from "../entities/post/api"
import {
  fetchComments as fetchCommentsApi,
  createComment,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
  likeComment as likeCommentApi,
} from "../entities/comment/api"
import { fetchUser } from "../entities/user/api"
import { fetchTags as fetchTagsApi } from "../entities/tag/api"
import type { Post, User } from "../types/api"

const PostsManager = () => {
  // URL 동기화
  useUrlSync()

  // Entity & Filter Atoms
  const [posts, setPosts] = useAtom(postsAtom)
  const setTotal = useSetAtom(totalAtom)
  const [filterState, setFilterState] = useAtom(filterStateAtom)
  const [comments, setComments] = useAtom(commentsAtom)
  const setTags = useSetAtom(tagsAtom)
  const [loading, setLoading] = useAtom(loadingAtom)

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

  // Load posts
  const loadPosts = async (): Promise<void> => {
    setLoading(true)
    try {
      const { posts: fetchedPosts, total: fetchedTotal } = await fetchPosts(filterState.limit, filterState.skip)
      setPosts(fetchedPosts)
      setTotal(fetchedTotal)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // Search posts
  const handleSearchPosts = async (): Promise<void> => {
    if (!filterState.searchQuery) {
      loadPosts()
      return
    }
    setLoading(true)
    try {
      const { posts: searchedPosts, total: searchedTotal } = await searchPostsApi(filterState.searchQuery)
      setPosts(searchedPosts)
      setTotal(searchedTotal)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch posts by tag
  const handleFetchPostsByTag = async (tag: string): Promise<void> => {
    if (!tag || tag === "all") {
      loadPosts()
      return
    }
    setLoading(true)
    try {
      const { posts: tagPosts, total: tagTotal } = await fetchPostsByTagApi(tag)
      setPosts(tagPosts)
      setTotal(tagTotal)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

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

  // Fetch comments
  const handleFetchComments = async (postId: number): Promise<void> => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const fetchedComments = await fetchCommentsApi(postId)
      setComments((prev) => ({ ...prev, [postId]: fetchedComments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // Add comment
  const handleAddComment = async (commentData: { body: string }): Promise<void> => {
    if (!selectedPost?.id) return
    try {
      const newComment = await createComment({
        body: commentData.body,
        postId: selectedPost.id,
        userId: 1,
      })
      setComments((prev) => ({
        ...prev,
        [newComment.postId]: [...(prev[newComment.postId] || []), newComment],
      }))
      setShowAddCommentDialog(false)
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // Update comment
  const handleUpdateComment = async (commentData: { body: string }): Promise<void> => {
    if (!selectedComment) return
    try {
      const updatedComment = await updateCommentApi(selectedComment.id, commentData.body)
      setComments((prev) => ({
        ...prev,
        [updatedComment.postId]: prev[updatedComment.postId].map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment,
        ),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // Delete comment
  const handleDeleteComment = async (id: number, postId: number): Promise<void> => {
    try {
      await deleteCommentApi(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // Like comment
  const handleLikeComment = async (id: number, postId: number): Promise<void> => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id)
      if (!currentComment) return

      const likedComment = await likeCommentApi(id, currentComment.likes)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === likedComment.id ? likedComment : comment)),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // Open post detail
  const handleOpenPostDetail = (post: Post): void => {
    setSelectedPost(post)
    handleFetchComments(post.id)
    setShowPostDetailDialog(true)
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

  // Load tags on mount
  useEffect(() => {
    const loadTags = async (): Promise<void> => {
      try {
        const fetchedTags = await fetchTagsApi()
        setTags(fetchedTags)
      } catch (error) {
        console.error("태그 가져오기 오류:", error)
      }
    }
    loadTags()
  }, [setTags])

  // Load posts when filter state changes
  useEffect(() => {
    if (filterState.selectedTag) {
      handleFetchPostsByTag(filterState.selectedTag)
    } else {
      loadPosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState.skip, filterState.limit, filterState.sortBy, filterState.sortOrder, filterState.selectedTag])

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
          <SearchFilterBar onSearch={handleSearchPosts} />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
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
          <Pagination />
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
