exports.success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ message, data });
};

exports.error = (res, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({ message });
};