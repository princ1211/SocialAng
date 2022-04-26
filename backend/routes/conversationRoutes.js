const router = require("express").Router();
const passport = require("passport");
const {
  newConversation,
  getUserConversations,
} = require("../controllers/conversationContoller");

router
  .route("/createConversation")
  .post(passport.authenticate("jwt", { session: false }), newConversation);
router
  .route("/getUserConversations")
  .get(passport.authenticate("jwt", { session: false }), getUserConversations);

module.exports = router;
