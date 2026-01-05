import asyncHandler from "../../utils/asyncHandler.js";
import {
  findAllPosts,
  findPostById,
  createPost,
  updatePost,
  deletePost,
} from "#models/post.model.js";

// GET /api/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await findAllPosts();

  res.success(posts)
});

// GET /api/posts/:postId
export const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await findPostById(postId);

  res.success(post)
});

// POST /api/posts
export const createPostHandler = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const newPost = await createPost({ title, content, user: "Anymous" });

  res.success(newPost, 201)
});

// PUT /api/posts/:postId
export const updatePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const updatedPost = await updatePost(postId, req.body);

  res.success(updatePost)
});

// DELETE /api/posts/:postId
export const deletePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await deletePost(postId);

  res.success(null)
});
