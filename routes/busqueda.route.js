/*
    Ruta: api/todo/: busqueda
*/

const { Router, request, response } = require("express");
const {
  getTodo,
  getDocumentosColeccion,
} = require("../controllers/busqueda.controller");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/:busqueda", [validarJWT, validarCampos], getTodo);

router.get("/coleccion/:tabla/:busqueda", validarJWT, getDocumentosColeccion);

module.exports = router;
