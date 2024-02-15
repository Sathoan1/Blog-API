const router = require("express").Router();
const {
  getAllBlogs,
  getABlog,
  createBlog,
  editBlog,
  publishBlog,
  deleteBlog,
  getUsersDraftsBlogs,
  getUsersPublishedBlogs,
} = require("../controllers/blogController");

router.get("/all/blog", getAllBlogs);

router.post("/user/blog", createBlog);
router.get("/user/published", getUsersPublishedBlogs);
router.get("/user/draft", getUsersDraftsBlogs);
router.patch("/user/publish/:blogId", publishBlog);
router
  .route("/user/blog/:blogId")
  .get(getABlog)
  .patch(editBlog)
  .delete(deleteBlog);

module.exports = router;
