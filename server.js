const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const db = require('./db');

const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
  console.log('listening to port 3000');
})