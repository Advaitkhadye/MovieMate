import React from 'react'
import { assets, dummyShowsData } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

  const navigate = useNavigate()

  const movie = dummyShowsData[Math.floor(Math.random() * dummyShowsData.length)];

  const movieImage = movie ? `url(${movie.backdrop_path})` : 'url("/backgroundImage.png")';

  return (
    <div className='flex flex-col items-start justify-center gap-4 px-4 md:px-16 lg:px-36 bg-cover bg-center h-screen text-white' style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0)), ${movieImage}` }}>

      {/* <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20"/> */}

      <h1 className='text-3xl md:text-[70px] md:leading-18 font-semibold max-w-2xl mt-20 pr-4'>{movie?.title}</h1>

      <div className='flex items-center gap-4 text-gray-300 text-sm md:text-base'>
        <span>{movie?.genres.map(g => g.name).slice(0, 3).join(" | ")}</span>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-4 h-4 md:w-4.5 md:h-4.5' /> {movie?.release_date?.split('-')[0]}
        </div>
        <div className='flex items-center gap-1'>
          <ClockIcon className='w-4 h-4 md:w-4.5 md:h-4.5' /> {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
        </div>
      </div>
      <p className='max-w-md text-gray-300 text-sm md:text-base'>{movie?.overview.slice(0, 150)}...</p>
      <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )

}

export default HeroSection
