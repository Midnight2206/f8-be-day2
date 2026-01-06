import asyncHandler from "../../utils/asyncHandler.js";
import {
  findPostById,
  createPost,
  updatePost,
  deletePost,
} from "#models/post.model.js";
import { PostPagination } from "#src/services/paginations/PostPagination.service.js";

// GET /api/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const { sort, page, per_page, userId } = req.query;
  let sortBy = [];
  let sortOrder = [];
  const pageNum = Number(page)
  const perPageNum = Number(per_page)
  if (sort) {
    const parts = sort.split(","); // ["id:asc", "title:dsc"]
    sortBy = [];
    sortOrder = [];

    parts.forEach((part) => {
      const [field, order] = part.split(":");
      sortBy.push(field);
      sortOrder.push(order ? order.toUpperCase() : "ASC");
    });
  }
  const pagination = new PostPagination({
     page: !isNaN(pageNum) && pageNum > 0 ? pageNum : 1,
  limit: !isNaN(perPageNum) && perPageNum > 0 ? perPageNum : 20,
  filter: { userId },
  sortBy: sortBy.length ? sortBy : undefined,
  sortOrder: sortOrder.length ? sortOrder : undefined
  })
  const posts = await pagination.execute();

  res.success(posts);
});

// GET /api/posts/:postId
export const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await findPostById(postId);

  res.success(post);
});

// POST /api/posts
export const createPostHandler = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const newPost = await createPost({ title, content, user: "Anymous" });

  res.success(newPost, 201);
});

// PUT /api/posts/:postId
export const updatePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const updatedPost = await updatePost(postId, req.body);

  res.success(updatePost);
});

// DELETE /api/posts/:postId
export const deletePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await deletePost(postId);

  res.success(null);
});
