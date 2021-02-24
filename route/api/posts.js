const express = require('express');
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const Post = require('../../models/Post')
const User = require('../../models/User')
const router = express.Router();

//@route POST api/posts
//@desc  Create new post
//@access Private
router.post('/', [auth, [
    check('text','Comment message is required').not().isEmpty()
]], async(req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }
    
    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save()
         res.json(post);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: 'Server error'});
    }
});

//@route GET api/posts
//@desc  Fetch all posts
//@access Private
router.get('/',auth ,async(req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
         res.json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: 'Server error'});
    }
});


//@route GET api/posts/post_id
//@desc  Fetch posts by ID
//@access Public
router.get('/:postID',auth ,async(req, res) => {
    try {
        const post = await Post.findById(req.params.postID)
        if(!post) return res.status(400).json({msg: 'Post not found'});
         res.json(post);
    } catch (error) {
        console.log(error.message);
        if(error === 'ObjectId') return res.status(400).json({msg: 'Post not found'});
        res.status(500).json({msg: 'Server error'});
    }
})

//@route DELETE api/posts/post_id
//@desc  Delete post by ID
//@access Public
router.delete('/:postID',auth ,async(req, res) => {
    try {
        const post = await Post.findById(req.params.postID)
        if(!post) return res.status(400).json({msg: 'Post not found'});
        //check if user is post owner
        if(post.user.toString() !== req.user.id) return res.status(401).json({msg: 'Not authorized to Delete'});
         res.send('Deletiin successful');
    } catch (error) {
        console.log(error.message);
        if(error === 'ObjectId') return res.status(400).json({msg: 'Post not found'});
        res.status(500).json({msg: 'Server error'});
    }
})

module.exports = router ;
