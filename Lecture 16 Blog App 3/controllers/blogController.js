const { createBlog, getAllBlogs, getMyBlogs } = require("../models/blogModel");
const { blogDataValidation } = require("../utils/blogUtils");

const createBlogController = async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Data",
      error: error,
    });
  }

  try {
    const blogDb = await createBlog({ title, textBody, userId });

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;

  try {
    const blogsDb = await getAllBlogs({ SKIP });

    if (blogsDb.length === 0)
      return res.send({
        status: 204,
        message: "No blogs found",
      });

    return res.send({
      status: 200,
      message: "Read success",
      data: blogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getMyBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const userId = req.session.user.userId;

  try {
    const myBlogsDb = await getMyBlogs({ SKIP, userId });

    if (myBlogsDb.length === 0)
      return res.send({
        status: 204,
        message: "No blogs found",
      });

    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
};
