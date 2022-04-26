const Post = require("../models/postModel");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");

exports.testFileUpload = async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
    }
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    let post;
    if (req.file) {
      const imageResult = await cloudinary.uploader.upload(req.file.path);
      post = await Post.create({
        userId: req.user._id.toString(),
        ...req.body,
        img: imageResult.secure_url,
        cloudinary_id: imageResult.public_id,
      });
    } else {
      post = await Post.create({
        userId: req.user._id.toString(),
        ...req.body,
      });
    }
    res.send({ success: true, response: post });
  } catch (err) {
    res.send({
      success: false,
      message: "could not create post",
      error: err.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.send({ success: false, message: "post with this id is not found" });
      res.end();
    }
    if (post.userId === req.user._id.toString()) {
      await post.updateOne({ $set: req.body });
      res.send({ success: true, message: "post updated sucessfully" });
    } else {
      res.send({ success: false, message: "you can update only your post" });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "cannot update a popst",
      error: err.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.img && post.userId === req.user._id.toString()) {
      await cloudinary.uploader.destroy(post.cloudinary_id);
    }
    if (!post) {
      res.send({ success: false, message: "post with this id is not found" });
      res.end();
    }
    if (post.userId === req.user._id.toString()) {
      await Post.deleteOne({ _id: req.params.id });
      res.send({ success: true, message: "post deleted sucessfully" });
    } else {
      res.send({ success: false, message: "you can delete only your post" });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "cannot delete a popst",
      error: err.message,
    });
  }
};

exports.likeOrDislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id.toString())) {
      await post.updateOne({ $push: { likes: req.user._id.toString() } });
      res.send({ success: true, message: "the post is liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.user._id.toString() } });
      res.send({ success: true, message: "the post is disliked" });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "cannot like or dislike this post",
      error: err.message,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.send({ success: false, message: "post not found" });
    }
    res.send({ success: true, response: post });
  } catch (err) {
    res.send({
      success: false,
      message: "error fetching the post",
      error: err.message,
    });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const currentUserPosts = await Post.find({
      userId: req.user._id.toString(),
    });
    const currentUserFriends = await User.find({
      _id: req.user._id.toString(),
    }).select("followings -_id");
    currentUserFriendsPosts = await Promise.all(
      currentUserFriends[0].followings.map(async (friend) => {
        return await Post.find({ userId: friend });
      })
    );

    currentUserFriendsPosts.map((friendpost) => {
      friendpost.map((post) => {
        currentUserPosts.push(post);
      });
    });
    res.send({ success: true, response: currentUserPosts });
  } catch (err) {
    res.send({
      success: false,
      message: "error fetching posts of your followers",
      error: err.message,
    });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send({ success: true, response: post.likes.length });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};
