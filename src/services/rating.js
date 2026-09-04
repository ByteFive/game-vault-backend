import rating from "../models/rating.js";
import Rating from "../models/rating.js";

export async function getAllByUser(userId) {
  return await Rating.find({ userId });
}

export async function getAllByGameId(gameId) {
  return await rating.find({ gameId });
}

export async function deleteRating(id, userId) {
  return await rating.deleteOne({ _id: id, userId });
}

export async function createRating(data) {
  return await Rating.create(data);
}

export async function updateRating(id, userId, data) {
  return await Rating.findOneAndUpdate({ _id: id, userId }, data, {
    returnDocument: "after",
  });
}
