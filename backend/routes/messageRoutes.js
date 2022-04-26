const router = require("express").Router();
const passport = require("passport");
const {
  newMessage,
  getMessagesOfaConversation,
} = require("../controllers/messageController");

router
  .route("/newMessage")
  .post(passport.authenticate("jwt", { session: false }), newMessage);
router.route("/getMessages/:conversationId").get(getMessagesOfaConversation);

module.exports = router;
