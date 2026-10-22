function notFound(req, res) {
  res
    .status(404)
    .json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  console.error(err);
  if (err.code === 'ER_DUP_ENTRY') {
    return res
      .status(409)
      .json({
        success: false,
        message: 'A record with the same unique value already exists.',
      });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res
      .status(400)
      .json({ success: false, message: 'A referenced record does not exist.' });
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res
      .status(409)
      .json({
        success: false,
        message: 'This record is being used by another record.',
      });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : 'Internal server error.',
  });
}
module.exports = { notFound, errorHandler };
