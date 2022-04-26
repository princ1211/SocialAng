const router = require("express").Router();
const passport = require("passport");
const upload = require("../config/multer");
const {
  createPost,
  updatePost,
  deletePost,
  likeOrDislike,
  getPost,
  getFeed,
  testFileUpload,
  getLikes,
  peopleYouMayKnow,
} = require("../controllers/postController");

//create a post
router
  .route("/createpost")
  .post(
    passport.authenticate("jwt", { session: false }),
    upload.single("postImage"),
    createPost
  );
// update a post
router
  .route("/updatepost/:id")
  .put(passport.authenticate("jwt", { session: false }), updatePost);
//delete a post
router
  .route("/deletepost/:id")
  .delete(passport.authenticate("jwt", { session: false }), deletePost);
//like or dislike a post
router
  .route("/likeordislike/:id")
  .put(passport.authenticate("jwt", { session: false }), likeOrDislike);
//get a post
router
  .route("/getpost/:id")
  .get(passport.authenticate("jwt", { session: false }), getPost);
//get posts of friends
router
  .route("/getuserfeed")
  .get(passport.authenticate("jwt", { session: false }), getFeed);
// get likes of a post
router.route("/getlikes/:id").get(getLikes);
//people you may know

//test file upload
router.route("/testupload").post(upload.single("postImage"), testFileUpload);

module.exports = router;
