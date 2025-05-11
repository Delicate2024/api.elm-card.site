// src/config/config.js
require('dotenv').config();

module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT || 3000,  // 可指定端口
};
