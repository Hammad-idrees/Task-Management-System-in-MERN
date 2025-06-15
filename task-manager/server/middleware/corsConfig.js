const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5000'], // Allow both Vite and server ports
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
