// api/index.js - Vercel serverless entry point
require('dotenv').config();
const app = require('../backend/index.js');

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Proxy to Express app
  return app(req, res);
};