import { Inngest, step } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

/**
 * USER CREATED — Add the user to the DB
 */
const syncUserData = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    await User.create(userData);
  }
);

/**
 * USER DELETED — Remove the user from the DB
 */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

/**
 * USER UPDATED — Update user details in the DB
 */
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

   const userData = {
      _id: id,
      
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData, { upsert: true });
  }
);



const releaseSeatsAndDeleteBooking = inngest.createFunction(
  {id: `release-seats-delete-booking`},
  {event: "app/checkpayment"},

  async ({event,step})=>{
    const tenMinutesLater = new Date(Date.now()+ 10 * 60 * 1000);
    await step.sleepUntil('wait-for-10-minutes',tenMinutesLater)

    await step.run('check-payment-status', tenMinutesLater);

    const bookingId = event.data.bookingId;
    const booking = await Booking.findById(bookingId)

    if(!booking.isPaid){
      const show = await Show.findById(booking.show);
      booking.bookedSeats.forEach((seat)=>{
        delete show.occupiedSeats[seat]
      })
      show.markModified('occupiedSeats')
      await show.save()
      await Booking.findByIdAndDelete(booking._id)
    }
    
  }
)

const sendBookingConfirmationEmail = inngest.createFunction(
  {id: "send-booking-confirmation-email"},
  {event:"app/show.booked"},
  async({event,step})=> {
    try {
      const {bookingId}= event.data;

      const booking = await step.run('fetch-booking-details', async () => {
        return await Booking.findById(bookingId).populate({
          path:'show',
          populate:{path: "movie",model:"Movie"}
        }).populate('user');
      });

      if (!booking) {
        throw new Error(`Booking not found: ${bookingId}`);
      }

      // Resolve user email: booking.user may be populated or a raw id
      let userDoc = null;
      if (booking.user && typeof booking.user === 'object' && booking.user.email) {
        userDoc = booking.user;
      } else if (booking.user) {
        try {
          userDoc = await User.findById(booking.user);
        } catch (e) {
          console.warn('Could not fetch user doc for booking:', bookingId, e && e.message ? e.message : e);
        }
      }

      const userEmail = userDoc?.email;
      const userName = userDoc?.name || 'Customer';

      if (!userEmail) {
        console.warn(`No email found for booking: ${bookingId}`);
        // Do not throw here — missing email should not crash the function
        return;
      }

      await step.run('send-confirmation-email', async () => {
        const response = await sendEmail({
          to: userEmail,
          subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
          body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hi ${userName},</h2>
        <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
        <p>
          <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
          <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
        </p>
        <p>Enjoy the show! 🍿</p>
        <p>Thanks for booking with us!<br/>- QuickShow Team</p>
    </div>`
        });
        console.log(`Email sent successfully for booking: ${bookingId}`);
        return response;
      });
    } catch (error) {
      console.error(`Error in sendBookingConfirmationEmail: ${error.message}`);
      throw error;
    }
  }

)


// Export all functions
export const functions = [
  syncUserData,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail
];
