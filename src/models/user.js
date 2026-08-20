import mongoose from "mongoose";

const user = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

const User = mongoose.model("User", user);
export default User;
