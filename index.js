const logger = require('morgan');
require('dotenv').config();
const express = require('express');
const app = express();
const getLimiter = require('./middleware/rate-limiter.js');
const auth = require('./routes/authRoutes.js');
const todos = require('./routes/todosRoutes.js');

app.use(getLimiter());
app.use(express.json());
app.use(logger('tiny'));
app.get('/', (req, res) => res.send('hello world') );

app.use('/', auth); //will add register and signin routes
app.use('/todos', todos); //will add todos crud operations


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
