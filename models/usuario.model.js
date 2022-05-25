const { Schema, model } = require("mongoose");


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    img: {
        type: String

    },
    rol: {
        type: String,
        required: true,
        default: "USER_ROLE"
    },
    google: {
        type: Boolean,
        default: false
    },
});



UsuarioSchema.method("toJSON", function () {
    const { __v, _id, password, ...resto } = this.toObject();
    resto.uid = _id;
    return resto;
})

module.exports = model("Usuario", UsuarioSchema);


