import Top5 from "../models/top5";

export async function getTop5ByUserId(userId) {
  return await Top5.find({ userId });
}

export async function getTop5ByPosition(userId, position) {
  return await Top5.findOne({ userId, position });
}

export async function createTop5(data) {
  return await Top5.create(data);
}

export async function updateTop5(userId, position, data) {
  return await Top5.findOneAndUpdate(
    { userId, position },
    data,
    { new: true, runValidators: true }
  );
}

export async function deleteTop5(userId, position) {
  return await Top5.deleteOne({ userId, position });
}