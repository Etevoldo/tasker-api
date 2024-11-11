const logger = require('morgan');
require('dotenv').config();
const auth = require('./routes/authRoutes.js');
const express = require('express');
const app = express();

app.use(express.json());
app.use(logger('tiny'));
app.get('/', (req, res) => res.send('hello world') );

app.use('/', auth); //will add register and signin routes


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
