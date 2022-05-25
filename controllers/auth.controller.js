const { request, response } = require("express");
const Usuario = require("../models/usuario.model");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { obtenerMenuFrontEnd } = require("../helpers/menu-frontend");


const login = async (req = request, res = response) => {

    const { email, password } = req.body

    try {



        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Email no encontrado"
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Contraseña no valida"
            });
        }

        //Generar el TOKEN- JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token: token,
            menu: obtenerMenuFrontEnd(usuarioDB.rol)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"

        });
    }
}

const googleSingIn = async (req = request, res = response) => {

    const googleToken = req.body.token;


    try {
        const { name, email, picture } = await googleVerify(googleToken);

        //Verificar si el usuario existe 

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: "@@@",
                img: picture,
                google: true
            });
        } else {
            // existe usuario 

            usuario = usuarioDB;
            usuario.google = true;

        }

        //Guardar en base de datos 

        await usuario.save();

        //General el TOKEN -JWT
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            token: token,
            menu: obtenerMenuFrontEnd(usuario.rol)
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: "Token no es correcto"
        })
    }


}


const renewToken = async (req = request, res = response) => {

    const uid = req.uid;


    //generamos el JWT
    const token = await generarJWT(uid);
    const usuarioDB = await Usuario.findById(uid);


    res.json({
        ok: true,
        msg: "Token renovado",
        token: token,
        usuario: usuarioDB,
        menu: obtenerMenuFrontEnd(usuarioDB.rol)
    });
}





module.exports = {
    login,
    googleSingIn,
    renewToken
}