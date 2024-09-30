const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const publicationRoutes = require('./routes/tasks.routes');

app.listen(3000)
app.use(cors()); 
app.use(morgan('dev'))
app.use(express.json())

app.use(publicationRoutes);

console.log('server on port 3000')