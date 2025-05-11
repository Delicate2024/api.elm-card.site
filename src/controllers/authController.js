// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');
const { generateCsrfToken } = require('../utils/csrfUtils');

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === 'xyj' && password === '666666') {
    const user = { username };
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '2h' });

    // 生成 CSRF Token
    const csrfToken = generateCsrfToken();

    // 设置 Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.cookie('csrfToken', csrfToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    return res.json({ success: true, message: '登录成功', csrfToken }); // 返回 CSRF Token
  }

  // 确保返回正确的 401 错误，并且错误信息格式正确
  return res.status(401).json({success: false, message: '用户名或密码错误' });
};

module.exports = {
  login,
};
