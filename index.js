require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const PORT = process.env.PORT || 3000;
const auth = require("./middleware/authentication");
const authRouter = require("./routes/authRoutes");
const blogRouter = require("./routes/blogRoutes");
//cloud config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.use(express.static("./public"));

//middleware
app.use(fileupload({ useTempFiles: true }));
app.use(express.json());
app.use(cors());

//routes
app.use("/api", authRouter);
app.use("/api", auth, blogRouter);

//error routes
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

//db Connection

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "BLOGG",
    });
    app.listen(PORT, () => {
      console.log(`server running on port : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
