const router = require("express").Router();
const {
  registerUser,
  loginUser,
  updateProfile,
  getUser,
} = require("../controllers/authController");
const auth = require("../middleware/authentication");

//public auth route
router.post("/register", registerUser);
router.post("/login", loginUser);

// private user route
router.get("/user", auth, getUser);
router.patch("/profile", auth, updateProfile);

module.exports = router;
