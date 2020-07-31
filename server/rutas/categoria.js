const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');
//NOTA: Este archivo se necesita importar en index.js

//mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find().sort('descripcion').populate('usuario', 'nombre email').exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categorias: categorias
        })
    });

});

//mostrar categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    console.log('el id: ', id);
    Categoria.findById(id, (err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categorias: categorias
        })
    });
});

//Crear nueva categoria
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    //regresa la nueva categoria
    //req.usuario.id //es el id de la persona que esta ejecutando esta instruccion que tiene un token valido
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => { //funcion de mongo
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

//actualizar categoria
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    //Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion, usuario: req.usuario._id }, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//borrar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;