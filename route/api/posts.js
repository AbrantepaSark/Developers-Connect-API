const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const User = require("../../models/User");
const router = express.Router();

//@route POST api/posts
//@desc  Create new post
//@access Private
router.post(
  "/",
  [
    auth,
    [
      check("category", "Must select category").not().isEmpty(),
      check("title", "Title is required").not().isEmpty(),
      check("text", "Message is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        category: req.body.category,
        title: req.body.title,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

//@route GET api/posts
//@desc  Fetch all posts
//@access Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: "Server error" });
  }
});

//@route GET api/posts
//@desc  Fetch all posts
//@access Public
router.get("/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({
      date: -1,
    });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: "Server error" });
  }
});

//@route GET api/posts/post_id
//@desc  Fetch posts by ID
//@access Public
router.get("/:postID", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID);
    if (!post) return res.status(400).json({ msg: "Post not found" });
    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error === "ObjectId")
      return res.status(400).json({ msg: "Post not found" });
    res.status(500).json({ msg: "Server error" });
  }
});

//@route GET api/posts/userID
//@desc  Fetch posts by userID
//@access Public
router.get("/:userID", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userID });
    if (!posts) return res.status(400).json({ msg: "No posts for user." });
    res.send(posts);
  } catch (error) {
    res.status(400).json({ msg: "Some error occurred." });
  }
});

//@route DELETE api/posts/post_id
//@desc  Delete post by ID
//@access Public
router.delete("/:postID", auth, async (req, res) => {
  //console.log(req.params);
  try {
    const post = await Post.findById(req.params.postID);
    if (!post) return res.status(400).json({ msg: "Post not found" });
    //check if user is post owner
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized to Delete" });
    await post.remove();
    res.send("Deletion successful");
  } catch (error) {
    console.log(error.message);
    if (error === "ObjectId")
      return res.status(400).json({ msg: "Post not found" });
    res.status(500).json({ msg: "Server error" });
  }
});

//@route PUT api/posts/likes/id
//@desc  like and dislike post
//@access Private
router.put("/likes/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.json({ msg: "Post not found" });
    }
    //check if post already liked by user
    if (post.likes.filter((like) => like.user == req.user.id).length > 0) {
      //Dislike post
      let likeIndex = post.likes.map((item) => item.user).indexOf(req.user.id);
      post.likes.splice(likeIndex, 1);
      await post.save();
      return res.json({ like: "DISLIKE" });
    }
    //like post
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json({ like: "LIKE" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

//@route POST api/posts/comments/id
//@desc  Post comment
//@access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Comment message is required").not().isEmpty()]],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findById(req.user.id).select("-password");

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      //like post
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments[0]);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

//@route DELETE api/posts/:id/comments/:com_id
//@desc  Delete comment
//@access Private
router.delete("/:id/comments/:com_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull out comment
    const comment = post.comments.find((com) => com.id === req.params.com_id);
    //if comment does not exist
    if (!comment) {
      return res.status(401).json({ msg: "Comment not found" });
    }
    let comIndex = post.comments
      .map((item) => item.id.toString)
      .indexOf(req.params.com_id);
    post.comments.splice(comIndex, 1);
    await post.save();
    res.json({ msg: "Comment deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
