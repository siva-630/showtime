import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { dummyShowsData, dummyDateTimeData, assets } from '../assets/assets';
import isoTimeformat from '../lib/isoTimeformat';
import { toast } from 'react-hot-toast';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';
import MyBokings from './MyBokings';

const SetLayout = () => {

  const {axios, getToken,user} = useAppContext();

  const groupRows = [["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null); 
  const [occupiedSeats,setOcupiedSeats] =useState([])

  const navigate = useNavigate();

  const getShow = async () => {

    try{
      const {data}= await axios.get(`/api/show/${id}`)
     if(data.success){
      setShow(data)
     } 

    }
    catch(error){
      console.log(error)

    }
    
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast.error("Please select time first");
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5){
      return toast.error("You can only select 5 seats");
    }
    if(occupiedSeats.includes(seatId)){
      return toast('This seat is already booked')
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => {
    return (
      <div key={row} className="flex gap-2 mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            return (
              <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                className={`h-8 w-8 rounded border border-primary/60 cursor-pointer transition
                  ${selectedSeats.includes(seatId) ? "bg-primary text-white" : "hover:bg-primary/20"} ${occupiedSeats.includes(seatId) ? "opacity-50 bg-red-500" : ""}`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

const getOccupiedSeats = async  ()=>{
  try{
    const {data} = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
     if(data.success){
      setOcupiedSeats(data.occupiedSeats)
     }else{
      console.error("Failed to fetch occupied seats:", data.message)
     }
  }catch(error){
    console.log("Error fetching occupied seats:", error);

  }
}

const bookTickets = async ()=>{
  try{
    if(!user) return toast.error('please login')
      if(!selectedTime || !selectedSeats.length) return toast.error('please selected time and seat');

    const {data}= await axios.post('/api/booking/create',{showId:selectedTime.showId,selectedSeats},{headers:{Authorization:`Bearer ${await getToken()}`}})

    if(data.success){
      toast.success(data.message);
      navigate('/my-bookings')
    }else{
      toast.error(data.message)
    }
  }catch(error){

    toast.error(error.message)
  }
}



  useEffect(() => {
    getShow();
  }, []);

  useEffect(()=>{
    if(selectedTime){
       getOccupiedSeats()
    }
  },[selectedTime])

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20">
      {/* Available timing */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-20">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date]?.map((item) => (
            <div
              key={item.time}
              className={`flex items-center gap-2 px-6 w-max rounded-r-md cursor-pointer transition
                ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}
              onClick={() => setSelectedTime(item)}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeformat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seats layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map((row) => renderSeats(row))}
              </div>
              

              
            ))}
            
          </div>
        </div>
        <div>
              <button onClick={bookTickets} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>Proced to checkout
                 <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/>
              </button>
             
            </div>
      </div>
    </div>
  );
};

export default SetLayout;
