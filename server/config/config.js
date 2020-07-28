// ===================
// Puerto
// ===================
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //si la variable process.env.NODE_ENV no existe estamos en desarrollo dev

//BASE DE DATOS
let urlBD;
//if (process.env.NODE_ENV === 'dev') {
//  urlBD = 'mongodb://localhost:27017/cafe';
//} else {
urlBD = 'mongodb+srv://admin:Zarzamoramora@cluster0.cgsgb.mongodb.net/cafe?retryWrites=true&w=majority';
//}

process.env.URLDB = urlBD;