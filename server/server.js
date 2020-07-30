require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

//middleware: funciones que se van a disparar cuando pase el codigo

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public para que se pueda acceder desde cualquier lugar, también se ocupa el path
app.use(express.static(path.resolve(__dirname, '../public'))); //la función del path hace el path


//consiguración global de rutas
app.use(require('./rutas/index'));
/*
await mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
*/

//el primer argumento viene de config.js
//el segundo argumento es para que no nos saliera un error 
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});