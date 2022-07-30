module.exports = (error, req, res, next) => {
  if (!(error instanceof Error)) return;
  console.log(error);
  res.status(500).json({ message: "Internal server error" });
};
