import React, { useState, useEffect } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Listshows = () => {

   const {axios,getToken,user}= useAppContext()
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {

      const {data} = await axios.get("/api/admin/all-shows",{
        headers :{Authorization: `Bearer ${await getToken()}`}
      })
      setShows(data.shows)
    
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteShow = async (id) => {
    try {
      const { data } = await axios.delete(`/api/admin/delete-show/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        toast.success(data.message);
        getAllShows(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting show');
    }
  };


// const getAllShows = async () => {
//   try {
//     const { data } = await axios.get("/api/admin/all-shows", {
//       headers: { Authorization: `Bearer ${await getToken()}` }
//     });

//     if (data.success) {
//       setShows(data.shows);
//     } else {
//       toast.error(data.message || "Failed to fetch shows");
//     }

//   } catch (error) {
//     console.error("Get Shows Error →", error);
//     toast.error(error.response?.data?.message || "Error fetching shows");
//   } finally {
//     setLoading(false);
//   }
// };



  useEffect(() => {
    getAllShows();
  }, []);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead className="bg-primary/10">
            <tr className="bg-primary/20 text-left text-white">
              <th className="text-left p-2">Movie Name</th>
              <th className="text-left p-2">Release Date</th>
              <th className="text-left p-2">Theater</th>
              <th className="text-left p-2">Show Time</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Total Bookings</th>
              <th className="text-left p-2">Total Revenue</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows.map((show, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/55 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                <td className="p-2">{show.movie.release_date}</td>
                <td className="p-2">{show.theater || 'Main Theater'}</td>
                <td className="p-2">{formatDate(show.showDateTime)}</td>
                <td className="p-2">{currency}{show.showPrice}</td>
                <td className="p-2">{show.totalTickets || 0}</td>
                <td className="p-2">
                  {currency}
                  {(show.totalRevenue || 0).toLocaleString()}
                </td>
                <td className="p-2">
                  <button 
                    onClick={() => deleteShow(show._id)} 
                    className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Listshows;
