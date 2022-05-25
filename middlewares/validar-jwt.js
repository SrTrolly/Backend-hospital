const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model")



const validarJWT = (req = request, res = response, next) => {

    //Leer el token 

    const token = req.header("x-token");

    if (!token) {
        res.status(401).json({
            ok: false,
            msg: "No hay token en la peticion"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "token no valido"
        });
    }



}

const validarADMIN_ROLE = async (req = request, res = response, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no existe"
            });
        }

        if (usuarioDB.rol !== "ADMIN_ROLE") {
            return res.status(403).json({
                ok: false,
                msg: "No tiene privilegios para hacer eso"
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}

const validarADMIN_ROLE_o_MismoUsuario = async (req = request, res = response, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no existe"
            });
        }

        if (usuarioDB.rol !== "ADMIN_ROLE" && uid !== id) {
            return res.status(403).json({
                ok: false,
                msg: "No tiene privilegios para hacer eso"
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}



module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}