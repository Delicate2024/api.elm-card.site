const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();

app.use(cors({
  origin: 'https://admin.elm-card.site',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
