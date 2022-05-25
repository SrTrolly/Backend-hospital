const {Schema,model}= require("mongoose");


const HospitalSchema =Schema({
    nombre:{
        type:String,
        required:true
    },
    img:{
        type:String
    },
    usuario:{
        required:true,
        type:Schema.Types.ObjectId,
        ref:"Usuario"
    }
},{collection:"hospitales"}); // Esto es para cambiar el nombre a la tabla



HospitalSchema.method("toJSON", function(){
    const {__v,_id,...resto}=this.toObject();
    resto.id=_id;
    return resto;
})

module.exports=model("Hospital", HospitalSchema);

