const { Schema, model } = require("mongoose");

const DoctorSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    hospital: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  { collection: "doctores" }
); // Esto es para cambiar el nombre a la tabla

DoctorSchema.method("toJSON", function () {
  const { __v, _id, ...resto } = this.toObject();
  resto.id = _id;
  return resto;
});

module.exports = model("Doctor", DoctorSchema);
