const { request, response } = require("express");
const Doctor = require("../models/doctor.models");
const Hospital = require("../models/hospital.models");

const getDoctores = async (req = request, res = response) => {

    const doctores = await Doctor.find().populate("usuario", "nombre img ").populate("hospital", "nombre img ");

    return res.json({
        ok: true,
        msg: "getDoctores",
        doctores: doctores
    })
}

const getDoctorById = async (req = request, res = response) => {
    const id = req.params.id;
    if (id === "nuevo") {
        return res.json({
            ok: false,
            msg: "doctor nuevo"
        })
    }
    const doctor = await Doctor.findById(id).populate("usuario", "nombre img ").populate("hospital", "nombre img ");

    try {


        return res.json({
            ok: true,
            msg: "Doctor por id",
            doctor: doctor
        })

    } catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}

const crearDoctor = async (req = request, res = response) => {

    const uid = req.uid;
    const { hospital, nombre } = req.body;

    const doctor = new Doctor({
        usuario: uid,
        hospital: hospital,
        nombre: nombre
    });

    try {

        const doctorDB = await doctor.save();

        return res.json({
            ok: true,
            msg: "crearDoctor",
            doctorDB: doctorDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}

const actualizarDoctor = async (req = request, res = response) => {

    const id = req.params.id;
    const uid = req.uid;
    const { nombre, hospital } = req.body;

    try {

        const doctorDB = await Doctor.findById(id);
        if (!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontro el doctor con el id"
            })
        }

        const hospitalDB = await Hospital.findById(hospital);

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontro el hospital con el id "
            })
        }

        const doctorCambio = {
            nombre: nombre,
            hospital: hospital,
            usuario: uid
        }

        const doctorActualizado = await Doctor.findByIdAndUpdate(id, doctorCambio, { new: true });

        res.json({
            ok: true,
            msg: "actualizar doctor",
            doctor: doctorActualizado
        })



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }


}

const eliminarDoctor = async (req = request, res = response) => {

    const id = req.params.id;

    try {



        const doctorDB = await Doctor.findById(id);
        if (!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: "No se encontro el doctor con el id"
            })
        }

        await Doctor.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Doctor eliminado"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}


module.exports = {
    getDoctores,
    crearDoctor,
    actualizarDoctor,
    eliminarDoctor,
    getDoctorById
}