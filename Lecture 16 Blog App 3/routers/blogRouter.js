const express = require("express");

const {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
} = require("../controllers/blogController");
const isAuth = require("../middlewares/isAuthMiddleware");

const blogRouter = express.Router();

blogRouter
  .post("/create-blog", isAuth, createBlogController)
  .get("/get-blogs", isAuth, getBlogsController)
  .get("/get-myblogs", isAuth, getMyBlogsController);

module.exports = blogRouter;
