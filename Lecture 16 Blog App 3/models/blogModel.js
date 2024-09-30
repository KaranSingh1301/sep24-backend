const { LIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema");

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new blogSchema({
      title: title,
      textBody: textBody,
      userId: userId,
      creationDateTime: Date.now(),
    });

    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await blogSchema.aggregate([
        { $sort: { creationDateTime: -1 } }, //DESC order
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const myBlogsDb = await blogSchema.aggregate([
        { $match: { userId: userId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      resolve(myBlogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { createBlog, getAllBlogs, getMyBlogs };
