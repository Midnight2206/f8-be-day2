import asyncHandler from "../../utils/asyncHandler.js";
import {
  findAllPosts,
  findPostById,
  createPost,
  updatePost,
  deletePost,
} from "#models/posts.model.js";

// GET /api/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await findAllPosts();

  res.json({
    success: true,
    message: "Posts retrieved successfully",
    data: posts,
  });
});

// GET /api/posts/:postId
export const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await findPostById(postId);

  res.json({
    success: true,
    message: "Post retrieved successfully",
    data: post,
  });
});

// POST /api/posts
export const createPostHandler = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const newPost = await createPost({ title, content });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: newPost,
  });
});

// PUT /api/posts/:postId
export const updatePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const updatedPost = await updatePost(postId, req.body);

  res.json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

// DELETE /api/posts/:postId
export const deletePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await deletePost(postId);

  res.json({
    success: true,
    message: "Post deleted successfully",
    data: null,
  });
});
