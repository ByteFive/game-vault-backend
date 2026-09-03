import { getProfile } from "../services/profile.js";

export async function getProfileController(req, res) {
  try {
    const userId = req.user.userId;

    const profile = await getProfile(userId);

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}
