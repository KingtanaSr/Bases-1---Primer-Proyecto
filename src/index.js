// Express es un framework que facilita la definición de rutas 
//para manejar diferentes solicitudes HTTP (GET, POST, PUT, DELETE, etc)

const express = require('express');  
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const publicationRoutes = require('./routes/tasks.routes');

app.listen(3000)
app.use(cors()); 
app.use(morgan('dev'))
app.use(express.json()) // Permite al servidor manejar correctamente los datos en formato JSON enviados en el cuerpo de las solicitudes HTTP

app.use(publicationRoutes);

console.log('server on port 3000')
