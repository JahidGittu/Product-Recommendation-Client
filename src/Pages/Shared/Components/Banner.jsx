import { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Typewriter } from 'react-simple-typewriter';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Banner = () => {
  const [sliderData, setSliderData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const res = await fetch('/SliderData.json');
        const data = await res.json();
        setSliderData(data);
      } catch (err) {
        console.error('Failed to fetch slider data:', err);
      }
    };
    fetchSliderData();
  }, []);

  useEffect(() => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
      const timer = setTimeout(() => swiperInstance.slideNext(), 1000);
      return () => clearTimeout(timer);
    }
  }, [swiperInstance]);

  const handleSwiperInit = useCallback((swiper) => {
    setSwiperInstance(swiper);
    setActiveIndex(swiper.realIndex);
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  if (sliderData.length === 0) return null;

  return (
    <div className="relative rounded-sm overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
        className="rounded-xl"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative w-full h-[400px] flex items-center justify-between px-6 md:px-24 py-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ef4444]/90 to-[#f97316]/90 z-0 rounded-xl" />

              {/* Content */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-6 text-white">
                {/* Text section */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <p className="text-lg font-semibold text-white/90">{slide.subtitle}</p>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    {activeIndex === index ? (
                      <Typewriter
                        key={`${slide.id}-${activeIndex}`}
                        words={[slide.title]}
                        cursor
                        typeSpeed={50}
                        deleteSpeed={20}
                        delaySpeed={1000}
                        loop={1}
                      />
                    ) : (
                      slide.title
                    )}
                  </h2>
                  <p className="text-md md:text-lg">{slide.description}</p>
                  <button className="mt-4 bg-white text-red-600 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition">
                    {slide.buttonText}
                  </button>
                </div>

                {/* Image section */}
                <div className="flex-1 flex justify-center items-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full max-w-md object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
