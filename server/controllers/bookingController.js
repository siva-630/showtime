
import Booking from '../models/Booking.js';


import Show from "../models/Show.js";

// function check avalibilty of seats for movie 


const checkSeatsAvailability = async (showId,selectedSeats)=>{
    try{
   const showData = await Show.findById(showId)
   if(!showData) return false;
   const occupiedSeats = showData.occupiedSeats;
   const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
   return !isAnySeatTaken;
    }
    catch(error){
        console.log(error.message);
        return false;
        

    }
}
export const  createBooking = async(req,res)=>{
    try{
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const userId = auth?.userId || null;
        const{showId,selectedSeats} = req.body;
        const{ origin }=req.headers;

        const isAvailable = await checkSeatsAvailability(showId,selectedSeats);
        if(!isAvailable){
            return res.json({success:false,message:"Selected seats are not available"});
        }
    //   get the shows details
    const showData = await Show.findById(showId).populate('movie');

    // create a new booking
    const booking = await Booking.create({
        user: userId,
        show: showId,
        amount: showData.showPrice * selectedSeats.length,
        bookedSeats: selectedSeats,
    })
    selectedSeats.forEach((seat)=>{
        showData.occupiedSeats[seat] = userId || 'guest';
    })
   showData.markModified('occupiedSeats');
   await showData.save();

//    stripe gateway

  res.json({success:true,message:'booked successfully'})
   

        }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})

    }
}

export const getOccupiedSeats = async (req,res)=>{
    try{
        const {showId} = req.params;
        const showData = await Show.findById(showId);
        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({success:true,occupiedSeats})

    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})

        
    }
}