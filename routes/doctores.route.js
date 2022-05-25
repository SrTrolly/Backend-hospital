/*
    Ruta: /api/doctor
*/

const { Router, } = require("express");
const { check } = require("express-validator");
const { crearDoctor, actualizarDoctor, eliminarDoctor, getDoctores, getDoctorById } = require("../controllers/doctor.controller");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");


const router = Router();

router.get("/", [
    validarJWT
], getDoctores);

router.get("/:id", [
    validarJWT
], getDoctorById)

router.post("/", [
    validarJWT,
    check("nombre", "El nombre del doctor es obligatorio").not().isEmpty(),
    check("hospital", "El hospital es obligatorio").not().isEmpty(),
    check("hospital").isMongoId(),
    validarCampos
], crearDoctor);

router.put("/:id", [
    validarJWT,
    check("nombre", "El nombre del doctor es obligatorio").not().isEmpty(),
    check("hospital", "El id  del hospital es obligatorio").not().isEmpty(),
    check("hospital").isMongoId(),
    validarCampos
], actualizarDoctor);

router.delete("/:id", [
    validarJWT
], eliminarDoctor);








module.exports = router;