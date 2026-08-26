import mongoose from "mongoose";

const top5Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gameId: {
      type: Number,
      required: true,
    },

    position: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

top5Schema.index({ userId: 1, position: 1 }, { unique: true });

top5Schema.index({ userId: 1, gameId: 1 }, { unique: true });

export default mongoose.model("Top5", top5Schema);
