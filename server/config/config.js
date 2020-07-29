// ===================
// Puerto
// ===================
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //si la variable process.env.NODE_ENV no existe estamos en desarrollo dev

//Vencimiento de Token
//60seg
// 60 min
// 24hrs
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//Seed de autentificación
// creamos una variable SEED en heroku para produccion, si algo viene toma ese valor y si no es de desarrollo
//Nota: para configurar variables es
//heroku config: set SEED="nombre" 
//para ver variables es heroku config
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//BASE DE DATOS
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    /*
    Para que las credenciales de la liga no esten a la vista, podemos crear una variable de entorno en heroku con el comando
    heroku config:set MONGO_URI="mongodb+srv://admin:<password>@cluster0.cgsgb.mongodb.net/<nombreBD>?retryWrites=true&w=majority"
    y poner process.env.MONGO_URI en vez de la liga
    */
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;