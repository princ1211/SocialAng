const express = require("express");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const postRoutes = require("./routes/postRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

//connect mongodb cloud
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb connected sucessfully");
});
connection.on("error", (err) => {
  console.log(err);
});

app.use(express.json());

//cors middleware
app.use(
  cors({
    origin: "*",
  })
);

//passportjs middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

//user routes
app.use("/user", userRoutes);
//conversation routes
app.use("/conversations", conversationRoutes);
//message routes
app.use("/messages", messageRoutes);
//post routes
app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
