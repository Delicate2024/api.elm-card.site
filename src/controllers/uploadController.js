// src/controllers/uploadController.js
const path = require('path');
const os = require('os');

const baseUploadDir = path.join(os.homedir(), 'elm-card', 'assets');

const upload = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: '没有文件上传',
    });
  }

  const fileDetails = req.files.map(file => {
    const relativePath = path.posix.join(file.fieldname, file.originalname);
    return {
      field: file.fieldname,
      filename: file.originalname,
      relativePath,
      size: file.size,
      mimeType: file.mimetype,
    };
  });

  console.log('上传的文件信息:', fileDetails);

  return res.json({
    success: true,
    message: '文件上传成功',
    files: fileDetails,
  });
};

module.exports = { upload };

