import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";



export const isAdmin = async (req, res) => {
    res.json({ success: true, isAdmin: true }) 
}







export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });

        const activeShows = await Show.find({
            showDateTime: { $gte: new Date() }
        }).populate("movie");

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce(
                (acc, booking) => acc + (booking.amount || 0), 
                0
            ),
            activeShows,
            totalUser
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        res.json({ success: false, message: error.message });
    }
};


// api to get all shows

export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 })
            .lean();

        const showsWithStats = await Promise.all(shows.map(async (show) => {
            // Find only PAID bookings for this specific show
            const paidBookings = await Booking.find({ show: show._id, isPaid: true });
            
            // Dynamically calculate accurate total tickets and revenue based on completed payments
            const totalTickets = paidBookings.reduce((sum, b) => sum + (b.bookedSeats?.length || 0), 0);
            const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
            
            return { ...show, totalTickets, totalRevenue };
        }));

        res.json({ success: true, shows: showsWithStats });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
// api to get all bookings

// export const getAllBookings = async (req, res) => {
//     try {
//         const bookings = await Booking.find({}).populate('user').populate({
//             path: 'show',
//             populate: { path: 'movie' }

//         }).sort({ createdAt: -1 });
//         res.json({ success: true, bookings });

//     }
//     catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }

// }



export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .sort({ createdAt: -1 })                 // ⬅ Sort first
            .populate('user')
            .populate({
                path: 'show',
                populate: { path: 'movie' }
            });

        res.json({ success: true, bookings });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const deleteShow = async (req, res) => {
    try {
        const { id } = req.params;
        await Show.findByIdAndDelete(id);
        res.json({ success: true, message: 'Show deleted successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
