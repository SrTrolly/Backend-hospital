const { request, response } = require("express");
const Usuario = require("../models/usuario.model");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req = request, res = response) => {
  //   const usuarios = await Usuario.find({}, "nombre");

  const desde = Number(req.query.desde) || 0;
  // const usuarios = await Usuario.find().skip(desde).limit(5);
  // const total = await Usuario.count();

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email rol google img ").skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    msg: "get Usuarios",
    usuarios: usuarios,
    uid: req.uid,
    total: total,
  });
};

const crearUsuario = async (req = request, res = response) => {
  const { email, password, nombre } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email: email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body);
    //Encriptar contraseña

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario: usuario,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarUsuario = async (req = request, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    //Actualizaciones
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email: email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario cono ese email",
        });
      }
    }

    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario de google no puede cambiar su correo"
      })
    }
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const eliminarUsuario = async (req = request, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioEncontrado = await Usuario.findById(uid);
    if (!usuarioEncontrado) {
      return res.status(400).json({
        ok: false,
        msg: "No existe el id en la base de datos",
      });
    }

    const { id } = usuarioEncontrado;
    await Usuario.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "El usuario esta eliminado",
      id: id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
