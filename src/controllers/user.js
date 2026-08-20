export function profile(req, res) {
  return res.json({
    message: "Você está autenticado",
    user: req.user,
  });
}
