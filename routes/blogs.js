const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blogs");
const Comment=require('../models/comments')
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, `../public/uploads`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});
router.get('/:id',async (req,res)=>{
  const id=req.params.id
  const blog=await Blog.findById(id).populate('createdBy');
  const comment=await Comment.find({blogId: id}).populate('createdBy')
  return res.render('blog',{user:req.user, blog,comment})
})
router.post('/comment/:blogId',async (req,res)=>{
   const comment =await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog =await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/`);
});
module.exports = router;
