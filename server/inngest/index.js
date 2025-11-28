import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Create an empty array where we'll export future Inngest functions
// inngest function save user data to  a database
const syncUserData = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{
        const {id,first_name,email_addresses,image_url}= event.data;
        const userData = {
            _id:id,
            name:first_name +" "+ last_name,
            email:email_addresses[0].email_address, 
            image:image_url
        };
        await User.create(userData);
    }
);






const syncUserDeletion = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{
        
      const {id}= event.data;
      await User.findByIdAndDelete(id);
    }
);


const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async({event})=>{
        const {id,first_name,email_addresses,image_url}= event.data;
           const userData = {
            _id:id,
            name:first_name +" "+ last_name,
            email:email_addresses[0].email_address, 
            image:image_url
        };
        await User.findByIdAndUpdate(id,userData);
    }
);
// Export the functions array with the syncUserData function included     

export const functions = [syncUserData,syncUserDeletion,syncUserUpdation];