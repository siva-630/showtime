import stripe from "stripe";

import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";


export const stripeWebhooks = async (request, response)=>{
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers["stripe-signature"];


    let event;
    try{
     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRKET
     event = stripeInstance.webhooks.constructEvent(request.body, sig, webhookSecret)

   }catch(error){
    return response.status(400).send(`webhook error: ${error.message} `)

   }


   try{
    switch(event.type){
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntent.id
            })

            const session = sessionList.data[0];
            const {bookingId} = session.metadata;

            await Booking.findByIdAndUpdate(bookingId,{
                isPaid:true,
                paymentLink:""
            })
        //   send maile
        await inngest.send({
            name:"app/show.booked",
            data:{bookingId}
        })


            break;

        }

        default:
            console.log('unhandle event type :',event.type)
    }
    response.json({received: true})

   }catch(error){

    console.error("Webhook processing error:",error)
    response.status(500).send("internal server error");
    

   }


}