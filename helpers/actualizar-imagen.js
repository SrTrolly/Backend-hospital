const Usuario = require("../models/usuario.model");
const Doctor = require("../models/doctor.models");
const Hospital = require("../models/hospital.models");

const fs = require("fs");

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    let pathviejo = "";
    switch (tipo) {
        case "doctores":
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                console.log("No se encontro el medico por id");
                return false;
            }

            pathviejo = `./uploads/doctores/${doctor.img}`;

            borrarImagen(pathviejo);

            doctor.img = nombreArchivo;
            doctor.save();
            return true;

            break;
        case "hospitales":
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log("No se encontro el hospital por id");
                return false;
            }

            pathviejo = `./uploads/hospitales/${hospital.img}`;

            borrarImagen(pathviejo);

            hospital.img = nombreArchivo;
            hospital.save();

            return true;
            break;
        case "usuarios":
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log("No se encontro el usuario por id");
                return false;
            }

            pathviejo = `./uploads/usuarios/${usuario.img}`;

            borrarImagen(pathviejo);

            usuario.img = nombreArchivo;
            usuario.save();
            return true;
            break;
    }
};

module.exports = {
    actualizarImagen,
};
