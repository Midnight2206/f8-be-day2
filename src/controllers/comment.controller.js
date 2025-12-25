import createHttpError from "http-errors";
import { loadDB, saveDB } from "#utils/jsonDB.js";
import asyncHandler from "#utils/asyncHandler.js";
import { nanoid } from "nanoid";


export const getComments = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const comments = await loadDB("comments");
    const postComments = comments.filter(comment => comment.postId === postId);
    res.json({ success: true, message: "Comments retrieved successfully", data: postComments });
})

export const addComment = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    
    const { author, content } = req.body;
    console.log(req.body);
    

    if (!author || !content) {
        return res.status(400).json({ message: "Author and content are required" });
    }

    const comments = await loadDB("comments");
    const newComment = {
        id: nanoid(),
        postId,
        author,
        content,
        createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    await saveDB("comments", comments);
    res.status(201).json({ success: true, message: "Comment added successfully", data: newComment });
})
export const updateCommentById = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    let { content } = req.body;
    const comments = await loadDB("comments");
    const commentIndex = comments.findIndex((c) => c.id === commentId);
    if (commentIndex === -1) {
        throw createHttpError(404, "Comment not found");
    }
    comments[commentIndex].content = content;
    comments[commentIndex].updatedAt = new Date().toISOString();
    await saveDB("comments", comments);
    res.json({
        success: true,
        message: "Comment updated successfully",
        data: comments[commentIndex],
    });
});
export const deleteCommentById = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comments = await loadDB("comments");
    const commentIndex = comments.findIndex((c) => c.id === commentId);
    if (commentIndex === -1) {
        throw createHttpError(404, "Comment not found");
    }
    const deletedComment = comments.splice(commentIndex, 1)[0];
    await saveDB("comments", comments);
    res.json({
        success: true,
        message: "Comment deleted successfully",
        data: deletedComment,
    });
});