import React, { useEffect, useState } from 'react';
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {

const {axios,getToken,user}= useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
   try{
     const {data} = await axios.get("/api/admin/all-bookings",{
        headers :{Authorization: `Bearer ${await getToken()}`}
      })

    setBookings(data.bookings)

   }catch(error){
    console.error(error);


   }
   setIsLoading(false)
  };

  // Simple date formatting helper
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : date.toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium pl-5">Show Time</th>
              <th className="p-2 font-medium pl-5">Seats</th>
              <th className="p-2 font-medium pl-5">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item, index) => (
              <tr key={index} className="border-b border-gray-700 text-white">
                <td className="p-2 min-w-45 pl-5">{item.user.name}</td>
                <td className="p-2">{item.show.movie.title}</td>
                <td className="p-2">{dateFormat(item.show.showDateTime)}</td>
                <td className="p-2 ">{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(" ,")}</td>
                <td className="p-2">{currency}{item.amount}</td>
                
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListBookings;
