const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    res.send({ success: true, message: "Registration Succesful" });
  } catch (err) {
    res.send({
      success: false,
      message: "user registraion failed",
      err: err.message,
    });
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.send({ success: false, message: `${email} is not registered` });
      return;
    }
    const isMatch = await user.matchpassword(password);
    if (isMatch) {
      const token = user.getSignedToken();
      res.send({
        success: true,
        message: "JWT " + token,
        user,
      });
    } else {
      res.send({ success: false, message: "Invalid Password" });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ success: false, message: "error finding user" });
  }
};

exports.socialLogin = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      const user = await User.create({
        username,
        email,
        password,
      });
    }
    user = await User.findOne({ email: email });
    const isMatch = await user.matchpassword(password);
    if (isMatch) {
      const token = user.getSignedToken();
      res.send({
        success: true,
        message: "JWT " + token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
        },
      });
    } else {
      res.send({ success: false, message: "Invalid Social Credentials" });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "user social login failed",
      err: err.message,
    });
  }
};

exports.currentUser = async (req, res) => {
  res.send({ success: true, user: req.user });
};

exports.updateUser = async (req, res) => {
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(2);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch (err) {
      console.log(err);
      res.send({ success: false, message: "failed to update password" });
    }
  }
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      $set: req.body,
    });
    res.send({ success: true, message: "User details updated" });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "user deails updation failed",
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id.toString());
    res.send({ success: true, message: "user deleted" });
  } catch (err) {
    res.send({
      success: false,
      message: "user deletion failed",
      error: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.send({ success: true, message: other });
  } catch (err) {
    res.send({
      success: false,
      message: "error finding user",
      error: err.message,
    });
  }
};

exports.followUser = async (req, res) => {
  const userToFollowId = req.params.id;
  const currentUserId = req.user._id.toString();
  if (userToFollowId !== currentUserId) {
    try {
      const userToFollow = await User.findById(userToFollowId);
      const currentUser = await User.findById(currentUserId);
      if (!userToFollow.followers.includes(currentUserId)) {
        await currentUser.updateOne({ $push: { followings: userToFollowId } });
        await userToFollow.updateOne({ $push: { followers: currentUserId } });
        res.send({ success: true, message: "user followed succesfully" });
      } else {
        res.send({ success: false, message: "already following this user" });
      }
    } catch (err) {
      res.send({ success: false, error: err.message });
    }
  } else {
    res.send({ success: false, message: "you cannot follow yourself" });
  }
};

exports.unFollowUser = async (req, res) => {
  const userToFollowId = req.params.id;
  const currentUserId = req.user._id.toString();
  if (userToFollowId !== currentUserId) {
    try {
      const userToFollow = await User.findById(userToFollowId);
      const currentUser = await User.findById(currentUserId);
      if (userToFollow.followers.includes(currentUserId)) {
        await currentUser.updateOne({ $pull: { followings: userToFollowId } });
        await userToFollow.updateOne({ $pull: { followers: currentUserId } });
        res.send({ success: true, message: "user unfollowed succesfully" });
      } else {
        res.send({ success: false, message: "you dont follow this user" });
      }
    } catch (err) {
      res.send({ success: false, error: err.message });
    }
  } else {
    res.send({ success: false, message: "you cannot unfollow yourself" });
  }
};

exports.getCurrentUserFriends = async (req, res) => {
  try {
    const currentUser = await User.find({ _id: req.user._id });
    const friends = await Promise.all(
      currentUser[0].followings.map(async (userId) => {
        return await User.findById({ _id: userId });
      })
    );
    res.send({ success: true, response: friends });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

exports.peopleYouMayKnow = async (req, res) => {
  try {
    const users = await User.find();
    const currentUser = await User.find({ _id: req.user._id });
    const currentUserFollowings = currentUser[0].followings;
    unFollwingUsers = users.filter((user) => {
      return (
        !currentUserFollowings.includes(user._id) &&
        user._id.toString() !== req.user._id.toString()
      );
    });
    res.send({ success: true, response: unFollwingUsers });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

exports.updateProfilePic = async (req, res) => {
  try {
    if (req.file) {
      const imageResult = await cloudinary.uploader.upload(req.file.path);
      const user = await User.findByIdAndUpdate(req.user._id, {
        profilePicture: imageResult.secure_url,
        cloudinary_id: imageResult.public_id,
      });
      res.send({ sucess: true, response: user });
    }
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

exports.updateCoverPic = async (req, res) => {
  try {
    if (req.file) {
      const imageResult = await cloudinary.uploader.upload(req.file.path);
      const user = await User.findByIdAndUpdate(req.user._id, {
        coverPicture: imageResult.secure_url,
        cloudinary_coverpic_id: imageResult.public_id,
      });
    }
    res.send({ success: true, response: user });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};
