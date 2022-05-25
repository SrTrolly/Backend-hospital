/*
    path: "api/login"
*/

const { Router, request, response } = require("express");
const { check } = require("express-validator");
const { login, googleSingIn, renewToken } = require("../controllers/auth.controller");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();


router.get("/renew", validarJWT, renewToken);

router.post("/", [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos
], login)

router.post("/google", [
    check("token", "El token de google es obligatorio").not().isEmpty(),
    validarCampos
], googleSingIn)








module.exports = router;