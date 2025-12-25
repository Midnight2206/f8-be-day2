import createHttpError from "http-errors";
import { loadDB, saveDB } from "#utils/jsonDB.js";
import asyncHandler from "#utils/asyncHandler.js";
import { nanoid } from "nanoid";

// GET /api/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await loadDB("posts");
  res.json({
    success: true,
    message: "Posts retrieved successfully",
    data: posts,
  });
});

// GET /api/posts/:postId
export const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const posts = await loadDB("posts");
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    throw createHttpError(404, "Post not found");
  }
  res.json({
    success: true,
    message: "Post retrieved successfully",
    data: post,
  });
});

// POST /api/posts
export const createPost = asyncHandler(async (req, res) => {
  let { title, content } = req.body;
  const posts = await loadDB("posts");
  const now = new Date().toISOString();

  const newPost = {
    id: nanoid(),
    user: "Anonymous",
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };

  posts.push(newPost);
  await saveDB("posts", posts);

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: newPost,
  });
});

// PUT /api/posts/:postId
export const updatePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  let { title, content } = req.body;
  
  const posts = await loadDB("posts");
  const postIndex = posts.findIndex((p) => p.id === postId);
  if (postIndex === -1) {
    throw createHttpError(404, "Post not found");
  }
  const post = posts[postIndex];
  posts[postIndex] = {
    ...post,
    title: title !== undefined ? title : post.title,
    content: content !== undefined ? content : post.content,
    updatedAt: new Date().toISOString(),
  };

  await saveDB("posts", posts);

  res.json({
    success: true,
    message: "Post updated successfully",
    data: posts[postIndex],
  });
});

// DELETE /api/posts/:postId
export const deletePostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const posts = await loadDB("posts");
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    throw createHttpError(404, "Post not found");
  }

  posts.splice(postIndex, 1);
  await saveDB("posts", posts);

  res.json({ success: true, message: "Post deleted successfully", data: null });
});
