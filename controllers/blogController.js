const Blog = require("../models/blog");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("writtenBy", "username");
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.json(error);
  }
};

//get single story
const getABlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById({ _id: blogId }).populate(
      "writtenBy",
      "username"
    );
    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.json(error);
  }
};

///*********** USER ROUTES******* */
const getUsersPublishedBlogs = async (req, res) => {
  const { userId } = req.user;
  try {
    const blogs = await Blog.find({
      writtenBy: userId,
      status: "published",
    }).populate("writtenBy", "username");
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.json(error);
  }
};
const getUsersDraftsBlogs = async (req, res) => {
  const { userId } = req.user;
  try {
    const blogs = await Blog.find({
      writtenBy: userId,
      status: "draft",
    }).populate("writtenBy", "username");
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.json(error);
  }
};
const createBlog = async (req, res) => {
  const { userId } = req.user;
  //get access to the image in the req.files

  try {
    //image upload
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "Bloggimages",
      }
    );
    req.body.image = result.secure_url;
    fs.unlinkSync(req.files.image.tempFilePath);
    req.body.writtenBy = userId;
    //send post request
    const blog = await Blog.create({ ...req.body });
    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
const editBlog = async (req, res) => {
  const { userId } = req.user;
  const { blogId } = req.params;
  try {
    const blog = await Blog.findOneAndUpdate(
      {
        _id: blogId,
        writtenBy: userId,
      },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.json(error);
  }
};

const publishBlog = async (req, res) => {
  const { userId } = req.user;
  const { blogId } = req.params;
  try {
    const blog = await Blog.findOneAndUpdate(
      {
        _id: blogId,
        writtenBy: userId,
      },
      { status: "published" },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.json(error);
  }
};
//deleteStory
const deleteBlog = async (req, res) => {
  const { userId } = req.user;
  const { blogId } = req.params;
  try {
    const blog = await Blog.findOneAndDelete({
      _id: blogId,
      writtenBy: userId,
    });
    res.status(200).json({ success: true, message: "Story deleted" });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  getAllBlogs,
  getABlog,
  createBlog,
  editBlog,
  publishBlog,
  deleteBlog,
  getUsersDraftsBlogs,
  getUsersPublishedBlogs,
};
