// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '123456') {
    const user = { username };
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '2h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    return res.json({ success: true, message: '登录成功' });
  }

  res.status(401).json({ success: false, message: '用户名或密码错误' });
};

module.exports = {
  login,
};
