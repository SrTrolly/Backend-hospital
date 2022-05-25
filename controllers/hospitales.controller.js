const { request, response } = require("express");
const Hospital = require("../models/hospital.models");

const getHospitales = async (req = request, res = response) => {

    const hospitales = await Hospital.find().populate("usuario", "nombre img");

    return res.json({
        ok: true,
        msg: "getHospitales",
        hospitales: hospitales
    })
}

const crearHospital = async (req = request, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalDB = await hospital.save();

        return res.json({
            ok: true,
            msg: "crearHospital",
            hospitalDB: hospitalDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }


}

const actualizarHospital = async (req = request, res = response) => {

    const id = req.params.id;
    const uid = req.uid;
    try {

        const hospitalDB = await Hospital.findById(id);
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontro el hospital con el id "
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            msg: "actualizar Hospital",
            hospital: hospitalActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }

}

const eliminarHospital = async (req = request, res = response) => {

    const id = req.params.id;


    try {
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontro el hospital a eliminar con el id"
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "hospital eliminado"
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablo con el administrador"
        });
    }


}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}