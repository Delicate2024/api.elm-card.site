// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { verifyCsrfToken } = require('../utils/csrfUtils');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/login', login);

// 用于验证 JWT Token 是否有效的路由
router.get('/verifyToken', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Token 有效' });
});

// 需要 JWT Token 和 CSRF Token 验证的受保护路由
router.post('/some-protected-route', verifyToken, verifyCsrfToken, (req, res) => {
  res.json({ success: true, message: '受保护的路由' });
});

module.exports = router;
