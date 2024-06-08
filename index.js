const express=require('express');
require('dotenv').config(); //!configuracion de las variables de entorno
const {dbConnection} = require('./db/config');
const cors=require('cors');

//* crear el servidor de express
const app= express();

//!BASE DE DATOS
dbConnection();

app.use(cors());

//* Directorio publico
app.use(express.static('public')); // un middleware es una función que se ejecuta siempre que pase por el servidor

//* Lectura y parseo del body
app.use(express.json())

//RUTAS 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));


//! escuchar peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`servidor iniciado en puerto ${process.env.PORT}`);
})