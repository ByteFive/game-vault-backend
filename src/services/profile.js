import Rating from "../models/rating.js";
import User from "../models/user.js";

export async function getProfile(userId) {

    const user = await User.findById(userId);

    const reviewsQuantity = await Rating.countDocuments({ user: userId });

    const profile = {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        reviewsQuantity,

    };
    
    return profile;
};