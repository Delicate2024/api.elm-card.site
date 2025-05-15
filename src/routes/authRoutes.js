// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { verifyCsrfToken } = require('../utils/csrfUtils');

const { verifyToken } = require('../middlewares/verifyTokenMiddleware');
const { uploadCheck } = require('../middlewares/uploadMiddleware');

const { login } = require('../controllers/loginController');
const { upload } = require('../controllers/uploadController');
const { getAssetFileList } = require('../controllers/downloadController.js');
const { deleteAssetFile } = require('../controllers/updateController');

router.post('/login', login);

// 用于验证 JWT Token 是否有效的路由
router.get('/verifyToken', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Token 有效' });
});

// 上传资产
router.post('/uploadAssets',
  verifyCsrfToken,
  uploadCheck,
  upload
);

// 查看资产清单
router.post('/getAssetFileList',
  verifyCsrfToken,
  getAssetFileList
);

// 删除资产
router.post('/deleteAsset', 
  verifyCsrfToken,
  deleteAssetFile
);

// 需要 JWT Token 和 CSRF Token 验证的受保护路由
router.post('/some-protected-route', verifyToken, verifyCsrfToken, (req, res) => {
  res.json({ success: true, message: '受保护的路由' });
});

module.exports = router;
