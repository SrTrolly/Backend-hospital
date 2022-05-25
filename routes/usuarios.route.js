/*
    Ruta: /api/usuarios
*/


const { Router, request, response } = require("express");
const { check } = require("express-validator");
const { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require("../controllers/usuario.controller");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require("../middlewares/validar-jwt");


const router = Router();

router.get("/", [
    validarJWT
], getUsuarios);

router.post("/", [
    check("nombre", "El nombre es obligarotio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El emails es obligatorio").isEmail(),
    validarCampos
], crearUsuario);

router.put("/:id", [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check("nombre", "El nombre es obligarotio").not().isEmpty(),
    check("email", "El emails es obligatorio").isEmail(),
    check("rol", "El rol es obligatorio").not().isEmpty(),
    validarCampos
], actualizarUsuario);

router.delete("/:id", [
    validarJWT,
    validarADMIN_ROLE
], eliminarUsuario);






module.exports = router;