// src/middlewares/uploadMiddleware.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');

const baseUploadDir = path.join(os.homedir(), 'elm-card', 'assets');

// 校验字段名是否合法，防止目录穿越等攻击
function isSafeFieldName(fieldName) {
  if (!fieldName || typeof fieldName !== 'string') return false;
  if (fieldName.includes('..')) return false;
  if (/[<>:"/\\|?*\x00-\x1F]/.test(fieldName)) return false;
  if (fieldName.startsWith('/') || fieldName.startsWith('\\')) return false;
  return true;
}

// 强制将 originalname 从 latin1 解码为 utf8，解决中文乱码问题
function decodeFilename(name) {
  return Buffer.from(name, 'latin1').toString('utf8');
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
    const safeName = decodeFilename(file.originalname);
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
      return res.status(400).json({ success: false, message: err.message, field: failedField });
    }
    next();
  });
};

module.exports = { uploadCheck };
