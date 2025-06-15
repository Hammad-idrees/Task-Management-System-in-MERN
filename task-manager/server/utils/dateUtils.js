const { format, isBefore } = require('date-fns');

exports.formatDate = (date) => {
  if (!date) return null;
  return format(date, 'yyyy-MM-dd');
};

exports.isPastDate = (date) => {
  if (!date) return false;
  return isBefore(date, new Date());
};