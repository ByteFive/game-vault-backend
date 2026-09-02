import rating from "../models/rating.js";
import Rating from "../models/rating.js";

export async function getAllByUser(userId) {
  const reviews = await Rating.find({ userId });
  return reviews;
}

export async function getAllByGameId(gameId) {
  const reviews = await rating.find({ gameId });
  return reviews;
}

export async function deleteRating(id) {
  const deleted = await rating.findByAndId(id);

  return deleted;
  
}

export async function createRating(data) {
  const rating = await Rating.create(data);
  return rating;
}

export async function updateRating(id, userId, data) {
  const updated = await Rating.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );
  return updated;
}




