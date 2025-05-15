// src/controllers/updateController.js
const fs = require('fs');
const path = require('path');
const os = require('os');

const baseUploadDir = path.join(os.homedir(), 'elm-card', 'assets');

// 删除文件
const deleteAssetFile = (req, res) => {
  const { type, name } = req.body;

  if (!type || !name) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数：type 和 name',
    });
  }

  const filePath = path.join(baseUploadDir, type, name);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('删除文件失败:', err);
      return res.status(500).json({
        success: false,
        message: '删除文件失败',
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: `文件 ${name} 已成功删除`,
    });
  });
};

module.exports = {
  deleteAssetFile,
};
