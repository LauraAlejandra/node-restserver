const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const { response } = require('express');

app.get('/usuario', verificaToken, (req, res) => {
    //res.json('get usuario local!!');

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios) => { //en el find despues de las llaves se ven los campos que se van a mostrar
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Usuario.count({ estado: true }, (err, conteo) => { //las primeras llaves es la condicion, por ejemplo google:true, tambien se pondría en las llaves del find
            res.json({
                ok: true,
                usuarios, //es como usuarios: usuarios
                cuantos: conteo
            });
        });

    });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => { //crear nuevos registros
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //el 10 es el numero de vueltas que se le hace el hash
        role: body.role
    });

    usuario.save((err, usuarioDB) => { //funcion de mongo
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

//usamos put cuando queremos actualizar data
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => { //crear nuevos registros
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => { //crear nuevos registros
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    /*
    ELIMINAR FISICAMENTE
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });*/
});

module.exports = app;