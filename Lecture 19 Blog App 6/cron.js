const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");

const cleanUpBin = () => {
  cron.schedule("* 0 * * *", async () => {
    try {
      //find all the deleted blogs from db
      const deletedBlogsDb = await blogSchema.find({ isDeleted: true });
      console.log(deletedBlogsDb);
      if (deletedBlogsDb.length === 0) return;

      let deletedBlogsId = [];
      //find out the blogs deleted 30 day ago.
      deletedBlogsDb.map((blog) => {
        const diff =
          (Date.now() - blog.deletionDateTime) / (1000 * 60 * 60 * 24);
        if (diff > 30) {
          deletedBlogsId.push(blog._id);
        }
      });

      if (deletedBlogsId.length === 0) return;

      const deletedBlog = await blogSchema.findOneAndDelete({
        _id: { $in: deletedBlogsId },
      });

      console.log(`Blog deleted successfully BlogId: ${deletedBlog._id}`);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = cleanUpBin;

// 0-59
