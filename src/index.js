// src/index.js
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { PORT } = require('./config/config');
const app = express();

app.use(cookieParser());
app.use(express.json());

// 路由
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
