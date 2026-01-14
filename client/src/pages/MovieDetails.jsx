import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MovieDetails = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)

  const handleWatchTrailer = () => {
    if (!show.movie.video_link) {
      toast.error("Trailer not available");
      return;
    }
    setShowTrailer(true);
  }

  const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext()

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setShow(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      const { data } = await axios.post('/api/user/update-favorite', { movieId: id }, { headers: { Authorization: `Bearer ${await getToken()}` } })

      if (data.success) {
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getShow()
  }, [id])

  return show ? (
    <div className='px-4 md:px-16 lg:px-40 pt-24 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>

        <img src={image_base_url + show.movie.poster_path} alt="" className='mx-auto md:mx-0 rounded-xl w-60 h-auto md:h-104 md:max-w-70 object-cover shadow-2xl' />

        <div className='relative flex flex-col gap-3 text-center md:text-left items-center md:items-start'>
          <BlurCircle top="-100px" left="-100px" />
          <p className='text-primary font-bold tracking-wider text-sm'>ENGLISH</p>
          <h1 className='text-3xl md:text-5xl font-bold max-w-2xl leading-tight'>{show.movie.title}</h1>
          <div className='flex items-center gap-2 text-gray-300 bg-white/5 py-1 px-3 rounded-full w-max'>
            <StarIcon className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium">{show.movie.vote_average.toFixed(1)} User Rating</span>
          </div>

          <p className='text-gray-400 mt-4 text-sm md:text-base leading-relaxed max-w-xl'>{show.movie.overview}</p>

          <p className='text-sm text-gray-300 font-medium mt-2'>
            {timeFormat(show.movie.runtime)} • {show.movie.genres.map(genre => genre.name).join(", ")} • {show.movie.release_date.split("-")[0]}
          </p>

          <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-6 w-full'>
            <button onClick={handleWatchTrailer} className='flex items-center justify-center gap-2 px-6 py-3 text-sm bg-white/10 hover:bg-white/20 transition rounded-full font-medium cursor-pointer active:scale-95 flex-1 md:flex-none border border-white/10'>
              <PlayCircleIcon className="w-5 h-5" />
              Trailer
            </button>
            <a href="#dateSelect" className='flex items-center justify-center px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 flex-1 md:flex-none shadow-lg shadow-primary/30'>Buy Tickets</a>
            <button onClick={handleFavorite} className='bg-white/10 hover:bg-white/20 p-3 rounded-full transition cursor-pointer active:scale-95 border border-white/10'>
              <Heart className={`w-5 h-5 ${favoriteMovies.find(movie => movie._id === id) ? 'fill-primary text-primary' : ""} `} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <h2 className='text-xl md:text-2xl font-bold mb-6 px-2 border-l-4 border-primary pl-4'>Top Cast</h2>
        <div className='overflow-x-auto no-scrollbar pb-6'>
          <div className='flex items-center gap-6 w-max px-2'>
            {show.movie.casts.slice(0, 12).map((cast, index) => (
              <div key={index} className='flex flex-col items-center text-center w-24'>
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3">
                  <img src={image_base_url + cast.profile_path} alt="" className='rounded-full w-full h-full object-cover border-2 border-white/10' />
                </div>
                <p className='font-medium text-xs md:text-sm text-gray-200 truncate w-full'>{cast.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <div className="mt-20 mb-10">
        <h2 className='text-xl md:text-2xl font-bold mb-8 px-2 border-l-4 border-primary pl-4'>You May Also Like</h2>
        <div className='flex flex-wrap justify-center gap-6'>
          {shows.slice(0, 4).map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      </div>

      <div className='flex justify-center mt-12 mb-20'>
        <button onClick={() => { navigate('/movies'); scrollTo(0, 0) }} className='px-8 py-3 text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition rounded-full font-medium cursor-pointer'>View All Movies</button>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'>
          <div className='relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden'>
            <button
              onClick={() => setShowTrailer(false)}
              className='absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2'
            >
              ✕
            </button>
            <ReactPlayer
              url={show.movie.video_link}
              width='100%'
              height='100%'
              controls
              playing
            />
          </div>
        </div>
      )}

    </div>
  ) : <Loading />
}

export default MovieDetails
