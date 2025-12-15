import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, required:false, ref:'User'},
    guestEmail:{type:String, required:false},
    show:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Show'},
    amount:{type:Number,required:true},
    bookedSeats: {type:Array,required:true},
    isPaid:{type:Boolean,default:false},
    paymentLink:{type:String},
},{timestamps:true  });


const Booking = mongoose.model("Booking",bookingSchema);
export default Booking;

// export default mongoose.model("Booking", bookingSchema);