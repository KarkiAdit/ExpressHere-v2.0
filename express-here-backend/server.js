const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const mongoose = require("mongoose");
const { request } = require("http");
const options = {
  keepAlive: true,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbUrl = `mongodb+srv://expressherev01:ctRfmWsDF9gSZsUZ@cluster0.jac2lby.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Mongo DB Connected successfully");
});

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentID: { type: String, required: true },
  commenterName: { type: String, required: true },
  associatedPostID: { type: String, required: true },
  commentBody: { type: String, default: "" },
});

const postSchema = new Schema(
  {
    postID: { type: String, required: true },
    author: { type: String, required: true },
    post: { type: String, require: true },
    saves: { type: Number, default: 0 },
    postCommentsIDs: { type: Array, default: [] }, // ids of user made posts
    postType: { type: String, required: true }, // false signifies that the user wants to post anonymously
    highlight: { type: String, required: true },
  },
  { timestamps: true }
);

const userSchema = new Schema({
  userID: { type: String, required: true },
  name: { type: String, required: true },
  savedPostsIDs: { type: Array, default: [] }, // ids of saved posts
  userPostsIDs: { type: Array, default: [] }, // ids of user made posts
  userCommentsIDs: { type: Array, default: [] }, // ids of user made posts
  password: { type: String, required: true },
});

const commentModel = mongoose.model("comment", commentSchema);
const postModel = mongoose.model("post", postSchema);
const userModel = mongoose.model("user", userSchema);

app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      data: "Successfully called!!",
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const userData = await userModel.findOne({ userID: req.body.userID });
    // if user exits, check whether the password matches
    if (userData.password === req.body.password) {
      console.log(userData);
      res.status(200).json({
        status: 200,
        data: userData,
      });
    } else {
      // if user doesn't exists or password doesn't match
      res.status(400).json({
        status: 400,
        message: "Wrong email/password! User doesn't exists!!",
      });
    }
  } catch (err) {
    // report error if ran under any issues
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const userData = await userModel.findOne({ userID: req.body.userID });
    if (userData) {
      // if user already exists
      res.status(400).json({
        status: 400,
        message: "Can't register using this email/phone! User already exists!!",
      });
    } else {
      // user doesn't exist!! add user login details to users table
      let user = new userModel(req.body);
      user = await user.save();
      res.status(200).json({
        status: 200,
        data: user,
      });
    }
  } catch (err) {
    // report error if ran under any issues
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.post("/share/:userID", async (req, res) => {
  try {
    // add postID of the current post to the data of author
    await userModel.findOneAndUpdate(
      { userID: req.params.userID },
      { $push: { userPostsIDs: req.body.postID } },
      { new: true }
    );
    // save author as anonymous name, if the user wants to make anonymous post
    if (!req.body.postType) {
      req.body.author = `anon${req.body.postID.length}`;
    }
    // add post to postSchema
    let post = new postModel(req.body);
    post = await post.save();
    res.status(200).json({
      status: 200,
      data: post,
    });
  } catch (err) {
    // report error if ran under any issues
    console.log(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.get("/comments/:postID", async (req, res) => {
  try {
    let post = await postModel.findOne({ postID: req.params.postID });
    let filteredComments = await Promise.all(
      post.postCommentsIDs.map(
        async (ID) => await commentModel.findOne({ commentID: ID })
      )
    );
    res.status(200).json({
      status: 200,
      data: filteredComments,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

app.post("/comment/:userID", async (req, res) => {
  try {
    // add commentID to the data of author who commented it
    await userModel.findOneAndUpdate(
      { userID: req.params.userID },
      { $push: { userCommentsIDs: req.body.commentID } },
      { new: true }
    );
    // add commentID to post data of respective post
    await postModel.findOneAndUpdate(
      { postID: req.body.associatedPostID },
      { $push: { postCommentsIDs: req.body.commentID } },
      { new: true }
    );
    // add the comment data making new comment model
    let comment = new commentModel(req.body);
    comment = await comment.save();
    res.status(200).json({
      status: 200,
      data: comment,
    });
  } catch (err) {
    // report error if ran under any issues
    console.log(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.get("/posts", async (req, res) => {
  try {
    let posts = await postModel.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

app.get("/userprofile/savedposts/:userID", async (req, res) => {
  try {
    let user = await userModel.findOne({ userID: req.params.userID });
    let posts = await postModel.find();
    let filteredPosts = posts.filter((post) => {
      let currentPost = user.savedPostsIDs.filter(
        (savedPostID) => savedPostID === post.postID
      );
      return currentPost[0];
    });
    res.status(200).json({
      status: 200,
      data: filteredPosts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

app.get("/userprofile/userposts/:userID", async (req, res) => {
  try {
    let user = await userModel.findOne({ userID: req.params.userID });
    let posts = await postModel.find();
    let filteredPosts = posts.filter((post) => {
      let currentPost = user.userPostsIDs.filter(
        (userPostID) => userPostID === post.postID
      );
      return currentPost[0];
    });

    res.status(200).json({
      status: 200,
      data: filteredPosts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

app.put("/discover/saveposts/:userID", async (req, res) => {
  try {
    // find the current user who sent the save request
    const user = await userModel.findOne({ userID: req.params.userID });
    // check whether the current post is already saved
    console.log(req.params.userID);
    if (!req.body.saves || !user.savedPostsIDs.length) {
      console.log("here");
      await userModel.findOneAndUpdate(
        { userID: req.params.userID },
        { $push: { savedPostsIDs: req.body.postID } },
        { new: true }
      );
      await postModel.findOneAndUpdate(
        { postID: req.body.postID },
        { $inc: { saves: 1 } },
        { new: true }
      );
    } else {
      console.log("here1");
      const findPost = user.savedPostsIDs.filter(
        (ID) => ID === req.body.postID
      );
      if (findPost.length) {
        await userModel.findOneAndUpdate(
          { userID: req.params.userID },
          { $pull: { savedPostsIDs: req.body.postID } },
          { new: true }
        );
        await postModel.findOneAndUpdate(
          { postID: req.body.postID },
          { $inc: { saves: -1 } },
          { new: true }
        );
      } else {
        console.log("here2");
        await userModel.findOneAndUpdate(
          { userID: req.params.userID },
          { $push: { savedPostsIDs: req.body.postID } },
          { new: true }
        );
        await postModel.findOneAndUpdate(
          { postID: req.body.postID },
          { $inc: { saves: 1 } },
          { new: true }
        );
      }
    }
    // load current post
    let posts = await postModel.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    // report error if ran under any issues
    console.log(err.message);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.delete("/username/delete/savedposts/:userID", async (req, res) => {
  try {
    await userModel.findOneAndUpdate(
      { userID: req.params.userID },
      { $pull: { savedPostsIDs: req.body.postID } },
      { new: true }
    );
    await postModel.findOneAndUpdate(
      { userID: req.body.postID },
      { $inc: { saves: -1 } },
      { new: true }
    );
    const posts = await postModel.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

app.delete("/username/delete/userposts/:userID", async (req, res) => {
  try {
    await postModel.findOneAndDelete({ postID: req.body.postID });
    await userModel.findOneAndUpdate(
      { userID: req.params.userID },
      { $pull: { userPostsIDs: req.body.postID } },
      { new: true }
    );
    const posts = await postModel.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

app.listen(port, function () {
  console.log("App listening at http://127.0.0.1:5000/");
});
