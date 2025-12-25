import { loadDB, saveDB } from "#utils/jsonDB.js";
import createHttpError from "http-errors";
import { nanoid } from "nanoid";

export const findAllPosts = async () => {
  return await loadDB("posts");
};

export const findPostById = async (postId) => {
  const posts = await loadDB("posts");
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    throw createHttpError(404, "Post not found");
  }

  return post;
};

export const createPost = async ({ title, content }) => {
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

  return newPost;
};

export const updatePost = async (postId, { title, content }) => {
  const posts = await loadDB("posts");
  const index = posts.findIndex((p) => p.id === postId);

  if (index === -1) {
    throw createHttpError(404, "Post not found");
  }

  const post = posts[index];

  posts[index] = {
    ...post,
    title: title !== undefined ? title : post.title,
    content: content !== undefined ? content : post.content,
    updatedAt: new Date().toISOString(),
  };

  await saveDB("posts", posts);
  return posts[index];
};

export const deletePost = async (postId) => {
  const posts = await loadDB("posts");
  const index = posts.findIndex((p) => p.id === postId);

  if (index === -1) {
    throw createHttpError(404, "Post not found");
  }

  posts.splice(index, 1);
  await saveDB("posts", posts);
};
