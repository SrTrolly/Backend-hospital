/*
    path: "api/hospital"
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { getHospitales, crearHospital, actualizarHospital, eliminarHospital } = require("../controllers/hospitales.controller");
const { validarCampos } = require("../middlewares/validar-campos");



const router = Router();

router.get("/", [
], getHospitales);

router.post("/", [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario").not().isEmpty(),
    validarCampos
], crearHospital);

router.put("/:id", [
    validarJWT,
    check("nombre", "El nombre dle hospital es necesario").not().isEmpty(),
    validarCampos
], actualizarHospital);

router.delete("/:id", [
    validarJWT
], eliminarHospital);


module.exports = router;