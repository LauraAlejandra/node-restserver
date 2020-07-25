require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//middleware: funciones que se van a disparar cuando pase el codigo

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json('get usuario')
});

app.post('/usuario', function(req, res) { //crear nuevos registros
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario',

        });
    } else {
        res.json({ persona: body });
    }
});

//usamos put cuando queremos actualizar data
app.put('/usuario/:id', function(req, res) { //crear nuevos registros
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) { //crear nuevos registros
    res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});