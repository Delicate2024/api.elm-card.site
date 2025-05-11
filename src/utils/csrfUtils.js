// src/utils/csrfUtils.js
const crypto = require('crypto');

// 生成 CSRF Token
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 验证 CSRF Token
const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token']; // 从请求头获取 CSRF Token
  const sessionToken = req.cookies.csrfToken; // 从 Cookies 获取 CSRF Token

  if (!csrfToken || csrfToken !== sessionToken) {
    return res.status(403).json({ success: false, message: '无效的 CSRF Token' });
  }

  next();
};

module.exports = {
  generateCsrfToken,
  verifyCsrfToken,
};
