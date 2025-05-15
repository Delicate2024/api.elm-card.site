// src/middlewares/validateDeleteParams.js
const path = require('path');
const os = require('os');
const fs = require('fs');

const baseUploadDir = path.join(os.homedir(), 'elm-card', 'assets');

const validateDeleteParams = (req, res, next) => {
  const { type, name } = req.body;

  if (!type || !name) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数：type 和 name',
    });
  }

  const targetPath = path.join(baseUploadDir, type, name);

  if (!targetPath.startsWith(baseUploadDir)) {
    return res.status(400).json({
      success: false,
      message: '非法路径访问',
    });
  }

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({
      success: false,
      message: '文件不存在',
    });
  }

  req.validatedFilePath = targetPath;
  next();
};

module.exports = validateDeleteParams;
