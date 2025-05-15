// src/middlewares/uploadMiddleware.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');

const baseUploadDir = path.join(os.homedir(), 'elm-card', 'assets');

function isSafeFieldName(fieldName) {
  if (!fieldName || typeof fieldName !== 'string') return false;
  if (fieldName.includes('..')) return false;
  if (/[<>:"/\\|?*\x00-\x1F]/.test(fieldName)) return false;
  if (fieldName.startsWith('/') || fieldName.startsWith('\\')) return false;
  return true;
}

function sanitizeFilename(filename) {
  return filename
    .normalize('NFKD') // 处理中文字符为 Unicode 安全格式
    .replace(/[^\w.\-()\u4e00-\u9fa5]/g, '_') // 替换非法字符
    .slice(0, 255); // 限制文件名长度（文件系统限制）
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fieldName = file.fieldname;

    if (!isSafeFieldName(fieldName)) {
      return cb(new Error(`非法字段名: ${fieldName}`));
    }

    const targetDir = path.join(baseUploadDir, fieldName);
    fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const safeName = sanitizeFilename(file.originalname);
    cb(null, safeName);
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`不支持的图片类型: ${file.mimetype}`), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).any();

const uploadCheck = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      const failedField = err.field || 'unknown';
      return res.status(400).json({
        success: false,
        message: err.message,
        field: failedField,
      });
    }
    next();
  });
};

module.exports = { uploadCheck };
