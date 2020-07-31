const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//obtener todos los productos
app.get('/productos', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find().sort('nombre').populate('usuario', 'nombre email').populate('categoria', 'descripcion').skip(desde).limit(limite).exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos: productos
        })
    });
});

//obtener un producto por id
app.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id).populate('usuario', 'nombre email').populate('categoria', 'descripcion').exec((err, productos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos: productos
        })
    });
});


//crear un nuevo producto
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => { //funcion de mongo
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

//actualizar un producto por id
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    }
    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//borrar un producto por id
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;
    let cambiaEstatus = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiaEstatus, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    //se hace una expresion regular para poder buscar por un termino el nombre del producto
    //se pueden buscar solo Ensa y ya salen todas las ensaladas, es decir la palabra incompleta
    let regex = new RegExp(termino, 'i');
    //el nombre del producto que viene en la coleccion tiene que ser igual al termino de los parametros
    Producto.find({ nombre: regex }).populate('categoria', 'descripcion').exec((err, productos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productos
        });
    });
});

module.exports = app;