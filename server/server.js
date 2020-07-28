require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

//middleware: funciones que se van a disparar cuando pase el codigo

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./rutas/usuario'));

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