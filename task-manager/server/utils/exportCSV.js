const { Parser } = require('json2csv');

exports.generateCSV = (fields, data) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};