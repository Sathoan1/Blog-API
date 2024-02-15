const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const handleError = require("../utils/error");

const registerUser = async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(201).json({
      success: true,
      user: { email: user.email, username: user.username },
    });
  } catch (error) {
    const errors = handleError(error);
    res.status(400).json(errors);
  }
};
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });
    if (!user) {
      throw Error("no user");
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw Error("invalid");
    }
    //generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      success: true,
      user: { email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    const errors = handleError(error);
    res.status(400).json(errors);
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.user;
  try {
    //profile picture upload
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "bloggImages",
      }
    );
    const profileUrl = result.secure_url;
    fs.unlinkSync(req.files.image.tempFilePath);
    req.body.writtenBy = userId;
    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { image: profileUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Profile changed" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
const getUser = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await Users.findById({ _id: userId }).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.json(error);
  }
};

module.exports = { registerUser, loginUser, updateProfile, getUser };
