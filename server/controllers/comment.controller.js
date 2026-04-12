import Comment from "../models/comment.model.js";
import { createError } from "../utils/error.js";

// Create
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, user } = req.body;

    if (user !== req.user.id) {
      return next(
        createError(403, "You are not allowed to create this comment"),
      );
    }

    const newComment = new Comment({
      content,
      postId,
      user,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

// Read
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({
        createdAt: -1,
      })
      .populate("user", "_id username avatar.secure_url");

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Create
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(createError(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// Update
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId.toString());

    if (!comment) {
      return next(createError(404, "Comment not found"));
    }
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return next(createError(403, "You are not allowed to edit this comment"));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $set: { content: req.body.content },
      },
      { new: true },
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

// Delete
export const deleteComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(createError(404, "Comment not found"));
  }
  if (comment.user._id !== req.user.id && !req.user.isAdmin) {
    return next(createError(403, "You are not allowed to delete this comment"));
  }

  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json("Comment has been deleted");
};

// Read
export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(createError(403, "You are not allowed to get all comments"));

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
