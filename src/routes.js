const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === '123456') {
    res.cookie('token', 'fake-jwt-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    return res.json({ success: true, message: '登录成功' });
  }

  res.status(401).json({ success: false, message: '用户名或密码错误' });
});

module.exports = router;
