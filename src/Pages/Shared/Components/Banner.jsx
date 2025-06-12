import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Banner = ({ sliderData, activeIndex, setActiveIndex }) => {



  if (sliderData.length === 0) return null;

  return (
    <div className="relative rounded-t-sm overflow-hidden">
      <div className="hidden md:flex justify-center px-24 py-3 bg-red-700 text-white font-bold text-lg rounded-t-xl select-none">
        <div className=" text-left">Queries</div>
        <div className='w-1/2'></div>
        <div className=" text-right">Recommendations</div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="rounded-b-xl"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <AnimatePresence mode="wait">
              {activeIndex === index && (


                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-auto flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-24 py-10 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-b-xl shadow-lg"
                >
                  {/* Mobile: Query Title */}
                  <div className="md:hidden w-full text-center font-bold text-lg mb-4">
                    কোয়েরী
                    <hr className="border-white/40 my-2 w-1/2 mx-auto" />
                  </div>

                  {/* Left part (Query) */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex-1 flex flex-col justify-center space-y-4 max-w-xl text-center md:text-left"
                  >
                    <h2 className="text-xl md:text-2xl font-bold leading-tight">{slide.queryTitle}</h2>

                    {slide.queryImage && (
                      <img
                        src={slide.queryImage}
                        alt={slide.queryTitle}
                        className="mx-auto md:mx-0 w-72 h-48 object-cover rounded-md shadow-md"
                      />
                    )}

                    <p className="text-lg font-semibold opacity-90">{slide.productName}</p>
                    <p
                      className="text-md max-h-14 overflow-hidden text-ellipsis"
                      title={slide.boycottReason}
                    >
                      {slide.boycottReason}
                    </p>
                    <button className="mt-4 bg-white text-red-600 font-semibold py-2 px-6 rounded shadow hover:bg-gray-100 transition w-max mx-auto md:mx-0">
                      View Details
                    </button>
                  </motion.div>

                  {/* Divider */}
                  <div className="hidden md:flex w-px h-80 bg-white/40 mx-10" />

                  {/* Mobile: Recommendation Title */}
                  <div className="md:hidden w-full text-center font-bold text-lg mt-10 mb-4">
                    রিকোমেন্ডেশন
                    <hr className="border-white/40 my-2 w-1/2 mx-auto" />
                  </div>

                  {/* Right part (Recommendation) */}
                  {slide.recommendation ? (
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="flex-1 flex flex-col justify-center items-center space-y-3 max-w-md text-white"
                    >
                      <p className="text-xl md:text-2xl font-bold">{slide.recommendation.productName}</p>
                      <img
                        src={slide.recommendation.productImage}
                        alt={slide.recommendation.productName}
                        className="mx-auto md:mx-0 w-72 h-48 object-cover rounded-md shadow-md"
                      />
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={slide.recommendation.recommenderPhoto}
                          alt={slide.recommendation.recommenderName}
                          className="w-10 h-10 rounded-full border-2 border-white"
                          title={`Recommended by ${slide.recommendation.recommenderName}`}
                        />
                        <span className="font-medium">{slide.recommendation.recommenderName}</span>
                      </div>
                      <div className="flex gap-6 mt-1 text-white/90">
                        <span>❤️ {slide.recommendation.likesCount}</span>
                        <span>💬 {slide.recommendation.commentsCount}</span>
                      </div>
                      <p className="mt-2 px-3 py-2 bg-white/20 rounded text-sm max-w-xs text-center italic">
                        {slide.recommendation.shortReason}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="flex-1 flex justify-center items-center text-white/70 italic text-lg mt-4"
                    >
                      No recommendations yet
                    </motion.div>
                  )}
                </motion.div>


              )}
            </AnimatePresence>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
