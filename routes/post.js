const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  post,
  getPosts,
  getSinglePost,
  editPost,
  deletePost,
} = require("../controllers/post");

router.post("/post", upload.single("files"), post);

router.get("/post", getPosts);

router.get("/post/:id", getSinglePost);

router.put("/post/", upload.single("files"), editPost);

router.delete("/post/:id", deletePost);

module.exports = router;
