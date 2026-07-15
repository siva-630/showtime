import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({

    movie:{type:String,required:true,ref:'Movie'},
    theater: { type: String, default: 'Main Theater' },
    showDateTime:{type:Date,required:true},
    showPrice:{type:Number,required:true},
    occupiedSeats:{type:Object, default:{}},
    
},{minimize:false}
)
const Show = mongoose.model("Show", ShowSchema);

export default Show;