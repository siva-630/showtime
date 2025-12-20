// import { Inngest, step } from "inngest";
// import User from "../models/User.js";
// import Booking from "../models/Booking.js"
// import Show from "../models/Show.js";
// import sendEmail from "../configs/nodeMailer.js";

// // Create a client to send and receive events
// export const inngest = new Inngest({ id: "movie-ticket-booking" });

// /**
//  * USER CREATED — Add the user to the DB
//  */
// const syncUserData = inngest.createFunction(
//   { id: "sync-user-from-clerk" },
//   { event: "clerk/user.created" },
//   async ({ event }) => {
//     const { id, first_name, last_name, email_addresses, image_url } = event.data;

//     const userData = {
//       _id: id,
      
//       email: email_addresses[0].email_address,
//       name: first_name + " " + last_name,
//       image: image_url,
//     };

//     await User.create(userData);
//   }
// );

// /**
//  * USER DELETED — Remove the user from the DB
//  */
// const syncUserDeletion = inngest.createFunction(
//   { id: "delete-user-with-clerk" },
//   { event: "clerk/user.deleted" },
//   async ({ event }) => {
//     const { id } = event.data;
//     await User.findByIdAndDelete(id);
//   }
// );

// /**
//  * USER UPDATED — Update user details in the DB
//  */
// const syncUserUpdation = inngest.createFunction(
//   { id: "update-user-from-clerk" },
//   { event: "clerk/user.updated" },
//   async ({ event }) => {
//     const { id, first_name, last_name, email_addresses, image_url } = event.data;

//    const userData = {
//       _id: id,
      
//       email: email_addresses[0].email_address,
//       name: first_name + " " + last_name,
//       image: image_url,
//     };

//     await User.findByIdAndUpdate(id, userData, { upsert: true });
//   }
// );



// const releaseSeatsAndDeleteBooking = inngest.createFunction(
//   {id: `release-seats-delete-booking`},
//   {event: "app/checkpayment"},

//   async ({event,step})=>{
//     const tenMinutesLater = new Date(Date.now()+ 10 * 60 * 1000);
//     await step.sleepUntil('wait-for-10-minutes',tenMinutesLater)

//     await step.run('check-payment-status', tenMinutesLater);

//     const bookingId = event.data.bookingId;
//     const booking = await Booking.findById(bookingId)

//     if(!booking.isPaid){
//       const show = await Show.findById(booking.show);
//       booking.bookedSeats.forEach((seat)=>{
//         delete show.occupiedSeats[seat]
//       })
//       show.markModified('occupiedSeats')
//       await show.save()
//       await Booking.findByIdAndDelete(booking._id)
//     }
    
//   }
// )

// const sendBookingConfirmationEmail = inngest.createFunction(
//   {id: "send-booking-confirmation-email"},
//   {event:"app/show.booked"},
//   async({event,step})=> {
//     try {
//       const {bookingId}= event.data;

//       const booking = await step.run('fetch-booking-details', async () => {
//         return await Booking.findById(bookingId).populate({
//           path:'show',
//           populate:{path: "movie",model:"Movie"}
//         }).populate('user');
//       });

//       if (!booking) {
//         throw new Error(`Booking not found: ${bookingId}`);
//       }

//       // Resolve user email: booking.user may be populated or a raw id
//       let userDoc = null;
//       if (booking.user && typeof booking.user === 'object' && booking.user.email) {
//         userDoc = booking.user;
//       } else if (booking.user) {
//         try {
//           userDoc = await User.findById(booking.user);
//         } catch (e) {
//           console.warn('Could not fetch user doc for booking:', bookingId, e && e.message ? e.message : e);
//         }
//       }

//       let userEmail = userDoc?.email || null;
//       let userName = userDoc?.name || 'Customer';

//       // fallback to contactEmail stored on booking (persisted at booking time)
//       if (!userEmail && booking.contactEmail) {
//         userEmail = booking.contactEmail;
//         userName = booking.contactEmail.split('@')[0] || userName;
//       }

//       if (!userEmail) {
//         console.warn(`No email found for booking: ${bookingId}`);
//         return;
//       }

//       await step.run('send-confirmation-email', async () => {
//         const response = await sendEmail({
//           to: userEmail,
//           subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
//           body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
//         <h2>Hi ${userName},</h2>
//         <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
//         <p>
//           <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
//           <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
//         </p>
//         <p>Enjoy the show! 🍿</p>
//         <p>Thanks for booking with us!<br/>- QuickShow Team</p>
//     </div>`
//         });
//         console.log(`Email sent successfully for booking: ${bookingId}`);
//         return response;
//       });
//     } catch (error) {
//       console.error(`Error in sendBookingConfirmationEmail: ${error.message}`);
//       throw error;
//     }
//   }

// )


// // Export all functions
// export const functions = [
//   syncUserData,
//   syncUserDeletion,
//   syncUserUpdation,
//   releaseSeatsAndDeleteBooking,
//   sendBookingConfirmationEmail
// ];










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
    const tenMinutesLater = new Date(Date.now()+ 10* 60 * 1000);
    await step.sleepUntil('wait-for-10-minutes',tenMinutesLater)

    const bookingId = await step.run('check-payment-status', async () => {
      return event.data.bookingId;
    });
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

      let userEmail = userDoc?.email || null;
      let userName = userDoc?.name || 'Customer';

      // fallback to contactEmail stored on booking (persisted at booking time)
      if (!userEmail && booking.contactEmail) {
        userEmail = booking.contactEmail;
        userName = booking.contactEmail.split('@')[0] || userName;
      }

      if (!userEmail) {
        console.warn(`No email found for booking: ${bookingId}`);
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


const sendShowReminders = inngest.createFunction(
  {id: "send-show-reminders"},
  {cron: "0 */8 * * *"},
  async({step})=>{
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 60 * 1000);
    const remainderTasks = await step.run("prepare-reminder-tasks", async () => {
      const tasks = [];
      const shows = await Show.find({
        showDateTime: { $gte: windowStart, $lte: in8Hours },
      }).populate('movie');

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats))];

        if (userIds.length === 0) continue;

        const users = await User.find({ _id: { $in: userIds } }).select("name email");

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showDateTime,
          });
        }
      }
      return tasks;
    });

    if (remainderTasks.length === 0) {
      console.log("No reminders to send in this cycle.");
      return;
    }

    const results = await step.run("send-reminders", async () => {
      return await Promise.allSettled(
        remainderTasks.map(tasks =>
          sendEmail({
            to: tasks.userEmail,
            subject: `Reminder: Upcoming Show "${tasks.movieTitle}"`,
            body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hi ${tasks.userName},</h2>
            <p>This is a friendly reminder for your upcoming show <strong style="color: #F84565;">"${tasks.movieTitle}"</strong>.</p>
            <p>Enjoy the show! 🍿</p>
            </div>`
          })
        )
      );
    });

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log("Show reminder results:", { sent, failed, total: results.length });

    return {
      sent,
      failed,
      message: `Sent ${sent} reminders, ${failed} failed.`
    };
  }
);


const sendNewShowNotifications = inngest.createFunction (
  {id: "send-new-show-notifications"},
  {event: "app/new.show.added"},
  async({event, step})=>{

    const {movieTitle, movieId   }= event.data;
    const users = await User.find({});
     for(const user of users){
      const userEmails = user.email;


      const subject = `New Show Added: "${movieTitle}" Now Playing!`;
      const body = `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hi ${user.name || 'there'},</h2>
      <p>We're excited to announce that a new show <strong style="color: #F84565;">"${movieTitle}"</strong> has been added to our lineup!</p>
      <p>Don't miss out on the action. Book your tickets now!</p>
      <p><a href="http://your-frontend-url/movies/${movieId}" style="background-color: #F84565; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Book Now</a></p>
      <p>See you at the movies! 🍿</p>
      </div>`;  
     
     await sendEmail({
      to: userEmails,
      subject: subject,
      body: body
    });

  }
  return { message: "New show notifications sent to all users." };
  }
)

// Export all functions
export const functions = [
  syncUserData,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotifications
];


