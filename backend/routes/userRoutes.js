const router = require("express").Router();
const passport = require("passport");
const upload = require("../config/multer");
const {
  register,
  authenticate,
  currentUser,
  socialLogin,
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unFollowUser,
  getCurrentUserFriends,
  peopleYouMayKnow,
  updateProfilePic,
  updateCoverPic,
} = require("../controllers/userControllers");
// User registration
router.route("/register").post(register);
//User login
router.route("/authenticate").post(authenticate);
//check user profile
router
  .route("/currentuser")
  .get(passport.authenticate("jwt", { session: false }), currentUser);
//User login with google
router.route("/sociallogin").post(socialLogin);
//Update user info
router
  .route("/updateuser")
  .put(passport.authenticate("jwt", { session: false }), updateUser);
//deactivate your account
router
  .route("/deleteuser")
  .delete(passport.authenticate("jwt", { session: false }), deleteUser);
//get a user with userid
router.route("/getuser/:id").get(getUser);
// follow a user
router
  .route("/:id/follow")
  .put(passport.authenticate("jwt", { session: false }), followUser);
//unfollow a user
router
  .route("/:id/unfollow")
  .put(passport.authenticate("jwt", { session: false }), unFollowUser);
//get user friends
router
  .route("/getuserfriends")
  .get(passport.authenticate("jwt", { session: false }), getCurrentUserFriends);
//people you may know
router
  .route("/peopleyoumayknow")
  .get(passport.authenticate("jwt", { session: false }), peopleYouMayKnow);
// update profile picture
router
  .route("/updateprofilepic")
  .put(
    passport.authenticate("jwt", { session: false }),
    upload.single("profilePic"),
    updateProfilePic
  );
//update cover photo
router
  .route("/updatecoverpic")
  .put(
    passport.authenticate("jwt", { session: false }),
    upload.single("coverPicture"),
    updateCoverPic
  );

module.exports = router;
