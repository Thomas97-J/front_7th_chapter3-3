import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components"
import { SearchFilterBar } from "../components/posts/SearchFilterBar"
import { PostTable } from "../components/posts/PostTable"
import { PostFormDialog } from "../components/posts/PostFormDialog"
import { PostDetailDialog } from "../components/posts/PostDetailDialog"
import { CommentFormDialog } from "../components/comments/CommentFormDialog"
import { UserInfoModal } from "../components/users/UserInfoModal"
import { Pagination } from "../components/shared/Pagination"
import type { Post, User, Comment, Tag, PostsApiResponse, UsersApiResponse } from "../types/api"
import type { CommentsState, NewPostState, NewCommentState, SortByOption, SortOrderOption } from "../types/state"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState<number>(0)
  const [skip, setSkip] = useState<number>(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState<number>(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState<string>(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState<SortByOption>((queryParams.get("sortBy") as SortByOption) || "")
  const [sortOrder, setSortOrder] = useState<SortOrderOption>(
    (queryParams.get("sortOrder") as SortOrderOption) || "asc",
  )
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [newPost, setNewPost] = useState<NewPostState>({ title: "", body: "", userId: 1 })
  const [loading, setLoading] = useState<boolean>(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState<string>(queryParams.get("tag") || "")
  const [comments, setComments] = useState<CommentsState>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewCommentState>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState<boolean>(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState<boolean>(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState<boolean>(false)
  const [showUserModal, setShowUserModal] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // URL 업데이트 함수
  const updateURL = (): void => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 가져오기
  const fetchPosts = (): void => {
    setLoading(true)
    let postsData: PostsApiResponse
    let usersData: User[]

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data: PostsApiResponse) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users: UsersApiResponse) => {
        usersData = users.users
        const postsWithUsers: Post[] = postsData.posts.map((post) => ({
          ...post,
          author: usersData.find((user) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 게시물 검색
  const searchPosts = async (): Promise<void> => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data: PostsApiResponse = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string): Promise<void> => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ])
      const postsData: PostsApiResponse = await postsResponse.json()
      const usersData: UsersApiResponse = await usersResponse.json()

      const postsWithUsers: Post[] = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
  const addPost = async (): Promise<void> => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data: Post = await response.json()
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async (): Promise<void> => {
    if (!selectedPost) return
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data: Post = await response.json()
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number): Promise<void> => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number): Promise<void> => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data: { comments: Comment[] } = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async (): Promise<void> => {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data: Comment = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async (): Promise<void> => {
    if (!selectedComment) return
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data: Comment = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number): Promise<void> => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number): Promise<void> => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id)
      if (!currentComment) return

      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: currentComment.likes + 1 }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: currentComment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post): void => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User): Promise<void> => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData: User = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    const loadTags = async (): Promise<void> => {
      try {
        const response = await fetch("/api/posts/tags")
        const data: Tag[] = await response.json()
        setTags(data)
      } catch (error) {
        console.error("태그 가져오기 오류:", error)
      }
    }
    loadTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy((params.get("sortBy") as SortByOption) || "")
    setSortOrder((params.get("sortOrder") as SortOrderOption) || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

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
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={searchPosts}
            tags={tags}
            selectedTag={selectedTag}
            onTagChange={(value) => {
              setSelectedTag(value)
              fetchPostsByTag(value)
              updateURL()
            }}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              onTagClick={(tag) => {
                setSelectedTag(tag)
                fetchPostsByTag(tag)
                updateURL()
              }}
              onUserClick={openUserModal}
              onViewDetail={openPostDetail}
              onEdit={(post) => {
                setSelectedPost(post)
                setShowEditDialog(true)
              }}
              onDelete={deletePost}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            limit={limit}
            onLimitChange={setLimit}
            skip={skip}
            total={total}
            onPageChange={(direction) => {
              if (direction === "prev") {
                setSkip(Math.max(0, skip - limit))
              } else {
                setSkip(skip + limit)
              }
            }}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        mode="create"
        title={newPost.title}
        body={newPost.body}
        userId={newPost.userId}
        onTitleChange={(title) => setNewPost({ ...newPost, title })}
        onBodyChange={(body) => setNewPost({ ...newPost, body })}
        onUserIdChange={(userId) => setNewPost({ ...newPost, userId })}
        onSubmit={addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <PostFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        mode="edit"
        title={selectedPost?.title || ""}
        body={selectedPost?.body || ""}
        onTitleChange={(title) => selectedPost && setSelectedPost({ ...selectedPost, title })}
        onBodyChange={(body) => selectedPost && setSelectedPost({ ...selectedPost, body })}
        onSubmit={updatePost}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentFormDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        mode="create"
        value={newComment.body}
        onValueChange={(body) => setNewComment({ ...newComment, body })}
        onSubmit={addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentFormDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        mode="edit"
        value={selectedComment?.body || ""}
        onValueChange={(body) => selectedComment && setSelectedComment({ ...selectedComment, body })}
        onSubmit={updateComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={selectedPost?.id ? comments[selectedPost.id] || [] : []}
        searchQuery={searchQuery}
        onAddComment={(postId) => {
          setNewComment({ ...newComment, postId })
          setShowAddCommentDialog(true)
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onDeleteComment={deleteComment}
        onLikeComment={likeComment}
      />

      {/* 사용자 모달 */}
      <UserInfoModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
