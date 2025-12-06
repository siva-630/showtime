import {clerkClient} from "@clerk/express"






export const protectAdmin =async(req,res,next)=>{

    
    try{
        const { userId }  = req.auth;

        const user = await clerkClient .users.getUser(userId)

            if (userId === "user_365olstjxLSsC2arOUzaJCUj0E8") {
            await clerkClient.users.updateUser(userId, {
                privateMetadata: { role: "admin" }
            });
            user.privateMetadata.role = "admin"; // reflect updated role in current request
        }




        if(user.privateMetadata.role  !== 'admin'){
            return resizeBy.json({success:false,message:"not authorized"})
        }

        next();



    }
    catch(error){
        return res.json({success:false,message:"not authoried"})
    }
}

// import { clerkClient } from "@clerk/express";

// export const protectAdmin = async (req, res, next) => {
//     try {
//         const { userId } = req.auth();

//         const user = await clerkClient.users.getUser(userId);

//         if (!user || user.privateMetadata.role !== 'admin') {
//             return res.status(403).json({ success: false, message: "Not authorized" });
//         }

//         next();
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Not authorized" });
//     }
// };


// import { clerkClient } from "@clerk/express";

// export const protectAdmin = async (req, res, next) => {
//     try {
//         const { userId } = req.auth;

//         // ✅ SUPER ADMIN BYPASS: Unconditional access for your specific ID
//         // This runs before checking Clerk or Database, guaranteeing access.
//         if (userId === "user_365olstjxLSsC2arOUzaJCUj0E8") {
//             return next(); 
//         }

//         // Standard check for other users
//         const user = await clerkClient.users.getUser(userId);

//         if (!user || user.privateMetadata.role !== 'admin') {
//             return res.status(403).json({ success: false, message: "Not authorized" });
//         }

//         next();
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Server error during auth" });
//     }
// };


