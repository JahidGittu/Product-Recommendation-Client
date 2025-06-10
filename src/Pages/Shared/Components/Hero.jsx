import React, { useEffect, useRef } from 'react';
import heroImage from '../../../assets/Lotties/Hero.json';
import backgroundImage from '../../../assets/images/HeroBg.png'
import Lottie from 'lottie-react';
import { motion, useAnimation } from "motion/react"
import { Transition } from '@headlessui/react';
import Wave from 'react-wavify';
import AnimatedImage from './AnimatedImage';




const Hero = () => {



  const lottieRef = useRef();
  const controls = useAnimation();

  useEffect(() => {
    // Lottie plays once on load
    lottieRef.current.play();
  }, []);

  const handleMouseEnter = () => {
    controls.start({ scale: 1.05, y: -5, transition: { type: 'spring', stiffness: 200 } });
  };

  const handleMouseLeave = () => {
    controls.start({ scale: 1, y: 0, transition: { type: 'spring', stiffness: 150 } });
  };



  return (
    <div
      className="min-h-[720px]  bg-base-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden z-5"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}>

      {/* Left Content */}
      <div className="w-full md:w-1/2 px-8 md:px-16 text-center md:text-left py-12 z-10 mt-24 md:mt-0">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-accent mb-4 relative" >
          Say <motion.span
            animate={
              {
                color: ['#fa5203', '#eb03fa', '#03a4fa'],
                transition: { duration: 4, repeat: Infinity }
              }}>Goodbye </motion.span>
          to <span className="text-gray-800 dark:text-gray-400">Bad Products</span>
          <AnimatedImage></AnimatedImage>
        </h1>

        <p className="text-gray-500 mb-6">
          Share what you don't like. Get suggestions you'll love. A helpful community for finding better product alternatives through experience-backed advice.
        </p>

        <button className="btn btn-primary">Explore Queries</button>
      </div>

      {/* Right Hero Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 z-5">
       
        {/* Left Lottie Animation */}
        <motion.div
          animate={controls}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full"
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={heroImage}
            onSuspendCapture={0.02}
            speed={0.03}
            loop={false}
            autoplay={false}
            style={{ width: '100%' }}
          />
        </motion.div>

      </div>


      {/* Optional overlay (if you want to dim background or blur) */}
      {/* <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm z-0" /> */}
      {/* Wave Bottom Effect */}

      <div className="absolute -bottom-5 left-0 w-full z-10 overflow-hidden">
        {/* Main wave */}
        <Wave
          fill="#490C5C"
          paused={false}
          options={{
            height: 10,
            amplitude: 60,
            speed: 0.2,
            points: 8,
          }}
          style={{ opacity: 0.7 }}
        />
      </div>

    </div >
  );
};

export default Hero;
