// src/controllers/downloadController.js
const fs = require('fs');
const path = require('path');
const os = require('os');

const baseUploadDir = path.join(os.homedir(), 'elm-card', 'assets');

const getAssetFileList = (req, res) => {
  const result = {};

  try {
    const dirs = fs.readdirSync(baseUploadDir, { withFileTypes: true });

    for (const dirent of dirs) {
      if (dirent.isDirectory()) {
        const subDir = path.join(baseUploadDir, dirent.name);
        const files = fs.readdirSync(subDir)
          .filter(name => fs.statSync(path.join(subDir, name)).isFile())
          .map(name => {
            const filePath = path.join(subDir, name);
            const stats = fs.statSync(filePath);
            return {
              name,
              type: dirent.name,
              size: stats.size, // 文件大小（Byte）
            };
          });

        result[dirent.name] = files;
      }
    }

    res.json({
      success: true,
      message: '文件清单获取成功',
      assets: result,
    });
  } catch (err) {
    console.error('获取文件清单出错:', err);
    res.status(500).json({
      success: false,
      message: '获取文件清单失败',
      error: err.message,
    });
  }
};

module.exports = { getAssetFileList };