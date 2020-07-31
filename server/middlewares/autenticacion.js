const jwt = require('jsonwebtoken');

//Verificar Token
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    /*res.json({
        token: token
    });*/
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario
        next(); //para que se ejecute lo que sigue de la funcion donde se llama el verificaToken
    });
};

//VERIFICA ADMIN ROLE
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

//VERIFICA TOKEN PARA IMAGEN
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario
        next(); //para que se ejecute lo que sigue de la funcion donde se llama el verificaToken
    });
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}