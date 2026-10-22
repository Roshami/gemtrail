function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
function positiveInt(value, fallback, max = 1000000) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= max ? n : fallback;
}
function optionalNumber(value, min, max, field) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) {
    const err = new Error(`${field} must be between ${min} and ${max}.`);
    err.status = 400;
    throw err;
  }
  return n;
}
function validateId(value, field = 'id') {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1) {
    const err = new Error(`Invalid ${field}.`);
    err.status = 400;
    throw err;
  }
  return n;
}
module.exports = { asyncHandler, positiveInt, optionalNumber, validateId };
