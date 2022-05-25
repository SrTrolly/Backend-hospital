const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { dbConnection } = require("./database/config");

const puerto = process.env.PORT;

//Crear el servidor de express

//mean_user
//mxCXAD763YvN4jbi

const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//conectar la base de datos
dbConnection();

//Directorio publico 
app.use(express.static("public"));

//Rutas
app.use("/api/hospital", require("./routes/hospitales.route"));
app.use("/api/usuarios", require("./routes/usuarios.route"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/doctor", require("./routes/doctores.route"));
app.use("/api/todo", require("./routes/busqueda.route"));
app.use("/api/upload", require("./routes/uploads.route"));

app.listen(puerto, () => {
  console.log(`Servidor corriendo en puerto ${puerto}`);
});
