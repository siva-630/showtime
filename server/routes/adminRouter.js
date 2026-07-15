import express from "express";
// import { protectAdmin } from "../middleware/auth.js";

import { 
  getAllBookings, 
  getAllShows, 
  getDashboardData, 
  isAdmin,
  deleteShow
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/is-admin', isAdmin);
adminRouter.get('/dashboard', getDashboardData);
adminRouter.get('/all-shows',getAllShows);
adminRouter.get('/all-bookings', getAllBookings);
adminRouter.delete('/delete-show/:id', deleteShow);

export default adminRouter;
