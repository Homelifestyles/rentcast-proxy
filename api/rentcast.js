module.exports = function (req, res) {
  res.status(200).json({ ok: true, node: process.version, env: !!process.env.RENTCAST_API_KEY });
};
