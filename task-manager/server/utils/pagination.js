exports.paginate = (page, limit) => {
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const skip = (page - 1) * limit;
  return { skip, limit };
};