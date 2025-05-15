// src/middlewares/verifyTokenMiddleware.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ success: false, message: '没有提供token' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: '无效的token' });
    }

    req.user = decoded;  // 将解码后的用户信息保存到请求中
    next();  // 继续后续处理
  });
};

module.exports = {
  verifyToken,
};
