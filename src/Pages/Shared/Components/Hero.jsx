import React from 'react';
import heroImage from '../../../assets/images/Hero.svg';
import backgroundImage from '../../../assets/images/HeroBg.png'
const Hero = () => {
  return (
    <div
      className="min-h-[720px]  bg-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden z-5"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}>

      {/* Left Content */}
      <div className="w-full md:w-1/2 px-8 md:px-16 text-center md:text-left py-12 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Landing <span className="text-gray-600">Page Background</span>
        </h1>
        <p className="text-gray-500 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula mauris eu varius imperdiet. Suspendisse ultricies mi diam, vitae molestie ipsum maximus vestibulum.
        </p>
        <button className="btn btn-primary">Read More</button>
      </div>

      {/* Right Hero Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 z-5">
        <img
          src={heroImage}
          alt="Hero"
          className="w-64 md:w-full drop-shadow-2xl"
        />
      </div>

      {/* Optional overlay (if you want to dim background or blur) */}
      {/* <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm z-0" /> */}
    </div>
  );
};

export default Hero;
