import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import QRCode from "react-qr-code";
import { toast } from 'react-hot-toast'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const { axios, getToken, user, isLoaded, image_base_url } = useAppContext()

  console.log("MyBookings Render: isLoaded:", isLoaded, "User:", user ? user.id : "null");

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const getMyBookings = async () => {
    console.log("getMyBookings START");
    try {
      const token = await getToken();
      if (!token) {
        console.log("No token available in getMyBookings");
        setIsLoading(false);
        return;
      }

      console.log("Fetching bookings from API...");
      const { data } = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("API Response:", data);

      if (data.success) {
        // Filter out bad data (where show or movie is null)
        const validBookings = data.bookings.filter(b => b.show && b.show.movie);
        setBookings(validBookings)
      } else {
        console.log("API returned success: false");
      }

    } catch (error) {
      console.log("Error in getMyBookings:", error)
    }
    console.log("getMyBookings END - setting isLoading false");
    setIsLoading(false)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This cannot be undone.")) {
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.post('/api/booking/cancel', { bookingId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        // Refresh bookings
        getMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel booking");
    }
  }

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        console.log("User loaded and present, calling getMyBookings");
        getMyBookings()
      } else {
        console.log("User loaded but null (not logged in)");
        setIsLoading(false)
      }
    } else {
      console.log("User not loaded yet");
    }
  }, [user, isLoaded])

  if (!isLoaded) return <Loading />

  if (!user) {
    return (
      <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] text-white flex justify-center items-center'>
        <p className="text-xl">Please log in to view your bookings.</p>
      </div>
    )
  }

  return !isLoading ? (
    <div className='relative px-4 md:px-16 lg:px-40 pt-24 md:pt-40 min-h-[80vh] text-white'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className='text-2xl font-bold mb-6'>My Bookings</h1>

      {bookings.length === 0 && (
        <div className="mt-10 text-gray-400 text-center md:text-left">
          <p>No valid bookings found.</p>
        </div>
      )}

      {bookings.map((item, index) => {
        const isFinished = new Date(item.show.showDateTime) < new Date();

        return (
          <div key={index} className='flex flex-col md:flex-row justify-between bg-white/5 border border-white/10 rounded-xl mt-4 p-4 w-full max-w-4xl mx-auto md:mx-0 overflow-hidden relative group'>
            {/* Background Gradient Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className='flex flex-row gap-4 relative z-10 w-full overflow-hidden'>
              <img src={image_base_url + item.show.movie.poster_path} alt="" className='w-20 md:w-32 aspect-[2/3] rounded-lg object-cover shadow-lg flex-shrink-0' />

              <div className='flex flex-col justify-center py-1 min-w-0 flex-1'>
                <h2 className='text-lg md:text-xl font-bold leading-tight truncate pr-2'>{item.show.movie.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-400">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300 whitespace-nowrap">{timeFormat(item.show.movie.runtime)}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">{dateFormat(item.show.showDateTime)}</span>
                </div>
                <p className='text-xs text-gray-500 mt-2 truncate'>ID: {item._id.slice(-6).toUpperCase()}</p>
                {isFinished && (
                  <span className="mt-2 inline-block bg-white/20 text-white text-xs px-2 py-1 rounded w-fit">Finished</span>
                )}
              </div>
            </div>

            <div className='flex flex-row md:flex-col justify-between items-center md:items-end mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0 relative z-10 w-full md:w-auto'>
              <div className='text-left md:text-right'>
                <p className='text-xs text-gray-400'>Total Amount</p>
                <p className='text-xl md:text-2xl font-bold text-primary'>{currency}{item.amount}</p>
              </div>

              <div className='flex flex-col items-end gap-2'>
                <div className='flex gap-2'>
                  {!isFinished && (
                    <button
                      onClick={() => handleCancelBooking(item._id)}
                      className='bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 text-sm rounded-full font-bold hover:bg-red-500/20 transition-colors shadow-lg active:scale-95 whitespace-nowrap cursor-pointer'
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedBooking(item)}
                    className='bg-white text-black px-4 md:px-6 py-2 text-sm rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg active:scale-95 whitespace-nowrap cursor-pointer'
                  >
                    View Ticket
                  </button>
                </div>
                <p className='text-xs text-gray-500 hidden md:block'>
                  {item.bookedSeats.length} Tickets • {item.bookedSeats.join(", ")}
                </p>
              </div>
            </div>

            {/* Mobile only seat info */}
            <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex justify-between text-xs text-gray-400 relative z-10 w-full">
              <span>{item.bookedSeats.length} Tickets</span>
              <span className="truncate max-w-[60%] text-right">Seats: <span className="text-white">{item.bookedSeats.join(", ")}</span></span>
            </div>

          </div>
        )
      })}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white p-6 rounded-lg max-w-sm w-full relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold text-xl cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-black text-xl font-bold mb-4">Your Ticket</h2>
            <QRCode value={selectedBooking._id} />
            <p className="text-black mt-4 text-center font-semibold">{selectedBooking.show.movie.title}</p>
            <p className="text-gray-600 text-sm">{dateFormat(selectedBooking.show.showDateTime)}</p>
            <p className="text-gray-600 text-sm mt-2">Seats: {selectedBooking.bookedSeats.join(", ")}</p>
            <p className="text-xs text-gray-400 mt-4">Booking ID: {selectedBooking._id}</p>
          </div>
        </div>
      )}

    </div>
  ) : <Loading />
}

export default MyBookings
