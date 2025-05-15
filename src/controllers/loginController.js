// src/controllers/loginController.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');
const { generateCsrfToken } = require('../utils/csrfUtils');

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === 'elm' && password === '20010717') {
    const user = { username };
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '2d' });

	// 生成伪 token 用来帮助跳转
	const redirectToken = jwt.sign({ redirect: true }, 'invalid-key', { expiresIn: '2d' });
	
    // 生成 CSRF Token
    const csrfToken = generateCsrfToken();

    // 设置 Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
	  maxAge: 2 * 24 * 60 * 60 * 1000, // 2天
    });
    res.cookie('csrfToken', csrfToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
	  maxAge: 2 * 24 * 60 * 60 * 1000,  // 与JWT token生命周期一致。
    });

    // 返回 CSRF 和伪 token
    return res.json({ success: true, message: '登录成功', csrfToken, redirectToken});
  }

  // 确保返回正确的 401 错误，并且错误信息格式正确
  return res.status(401).json({success: false, message: '用户名或密码错误' });
};

module.exports = {
  login,
};
