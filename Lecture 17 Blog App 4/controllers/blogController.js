const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlogWithId,
} = require("../models/blogModel");
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

const editBlogController = async (req, res) => {
  //Data validation
  //find the blog with blogId
  //ownership check
  //if time is less than 30 mins
  //update the blog

  console.log(req.body);
  const { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;
  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data invalid",
      error: error,
    });
  }

  try {
    const blogDb = await getBlogWithId({ blogId });
    console.log(blogDb);

    //id1.equals(id2)
    //id1.toString() === id2.toString()

    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allow to edit this blog",
      });
    }

    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60);
    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allow to edit the blog after 30 mins of creation",
      });
    }

    const updatedBlogDb = await editBlogWithId({ title, textBody, blogId });

    return res.send({
      status: 200,
      message: "Blog updated successfully",
      data: updatedBlogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const deleteBlogController = async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    const blogDb = await getBlogWithId({ blogId });

    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allow to delete this blog",
      });
    }

    const deletedBlogDb = await deleteBlogWithId({ blogId });

    return res.send({
      status: 200,
      message: "Delete successfull",
      data: deletedBlogDb,
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
  editBlogController,
  deleteBlogController,
};
