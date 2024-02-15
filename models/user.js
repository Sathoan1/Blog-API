const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: 6,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: isEmail,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    profile: {
      type: String,
      required: true,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/120px-User-avatar.svg.png?20201213175635",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //hash password
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
