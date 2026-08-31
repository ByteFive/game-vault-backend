import mongoose from "mongoose";

const libraryGameSchema = new mongoose.Schema(
  {
    gameId: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["want_to_play", "playing", "completed", "dropped"],
      required: true,
      default: "want_to_play",
    },
  },
  {
    _id: false,
  },
);

const librarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    games: {
      type: [libraryGameSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Library", librarySchema);
