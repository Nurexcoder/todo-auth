
const { validationResult } = require("express-validator");
const router = require("express").Router();



const Posts = require("../Models/Posts");


// 'file' comes from the Blob or File API

const { fetchUser, fetchAdmin } = require("../middleware/fetchUser");
const User = require("../Models/User");
// const router = express.router()

router.post("/", fetchUser, async (req, res) => {
    try {
        const UploadData = await Posts.create({
            title: req.body.title,
            desc: req.body.desc,
            createdBy: req.user.id,
        });
        res.status(200).json(UploadData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!");
    }
});

router.get("/", fetchUser, async (req, res) => {
    try {
        // const posts=await Posts.find({'createdBy':{$elemMatch:{}}})
        let posts = await Posts.find({ createdBy: req.user.id });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!");
    }
});
router.put("/:id", fetchUser, async (req, res) => {
    try {
        // const posts=await Posts.find({'createdBy':{$elemMatch:{}}})
        let posts = await Posts.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!");
    }
});
router.delete("/:id", fetchUser, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (post.createdBy === req.user.id) {
            await Posts.findByIdAndRemove(req.params.id);

            res.status(200).send("Post has been deleted");
        } else {
            res.status(401).send("You cannot delete this post");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!");
    }
});

module.exports = router;
