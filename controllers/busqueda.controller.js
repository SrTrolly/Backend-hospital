const { request, response } = require("express");
const Usuario = require("../models/usuario.model");
const Doctor = require("../models/doctor.models");
const Hospital = require("../models/hospital.models");

const getTodo = async (req = request, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios, doctores, hospitales] = await Promise.all([
    await Usuario.find({ nombre: regex }),
    await Doctor.find({ nombre: regex }),
    await Hospital.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    msg: "getTodo",
    usuarios: usuarios,
    doctores: doctores,
    hospitales: hospitales,
  });
};

const getDocumentosColeccion = async (req = request, res = response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");
  let data = [];

  switch (tabla) {
    case "doctores":
      data = await Doctor.find({ nombre: regex })
        .populate("usuario", "nombre img")
        .populate("hospital", "nombre img");
      break;

    case "hospitales":
      data = await Hospital.find({ nombre: regex }).populate(
        "usuario",
        "nombre img"
      );

      break;

    case "usuarios":
      data = await Usuario.find({ nombre: regex });

      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "La tabla tiene que ser usuarios/doctores/hospitales",
      });
  }

  res.json({
    ok: true,
    resultados: data,
  });
};

module.exports = {
  getTodo,
  getDocumentosColeccion,
};
