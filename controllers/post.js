const Post = require("../model/Post");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.post = async (req, res) => {
  const { originalname, path } = req.file;
  const originalNameParts = originalname.split(".");
  const originalNameExt = originalNameParts[originalNameParts.length - 1];
  const newPath = path + "." + originalNameExt;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWTSECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, content } = req.body;

    const postDoc = await Post.create({
      title,
      cover: newPath,
      content,
      author: info.id,
    });
    res.json(postDoc);
  });
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["firstname", "lastname", "email"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
};

exports.getSinglePost = async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", [
    "email",
    "firstname",
    "lastname",
  ]);
  return res.json(postDoc);
};

exports.editPost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const originalNameParts = originalname.split(".");
    const originalNameExt = originalNameParts[originalNameParts.length - 1];
    const newPath = path + "." + originalNameExt;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWTSECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, content, id } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      res.status(400).json({ error: "Your are not the author" });
    }
    await postDoc.updateOne({
      title,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    return res.json(postDoc);
  });
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.deleteOne({ _id: id })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
};
