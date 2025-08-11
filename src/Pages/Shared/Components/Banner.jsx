import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Banner = ({ sliderData, activeIndex, setActiveIndex }) => {
  if (!sliderData || sliderData.length === 0) return null;

  return (
    <div className="relative rounded-t-sm overflow-hidden bg-white">
      {/* Top Bar */}
      <div className="hidden md:grid grid-cols-2 text-center px-8 py-3 bg-[#4B0C5D] text-white font-bold text-lg rounded-t-xl select-none">
        <div className="flex items-center justify-center">Queries</div>
        <div className="flex items-center justify-center">Recommendations</div>
      </div>

      {/* Slider */}
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
                  className="relative w-full flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-8 md:py-12 bg-gradient-to-r from-[#4B0C5D] to-[#951B80] text-white rounded-b-xl shadow-lg"
                >
                  {/* Mobile: Query Title */}
                  <div className="md:hidden w-full flex items-center justify-center font-bold text-xl sm:text-2xl mb-4 rounded-xl p-2 bg-[#4B0C5D]">
                    Query
                  </div>

                  {/* Left part (Query) */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex-1 flex flex-col justify-center space-y-4 max-w-xl text-center md:text-left"
                  >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      {slide.queryTitle}
                    </h2>

                    {slide.queryImage && (
                      <img
                        src={slide.queryImage}
                        alt={slide.queryTitle || 'Query image'}
                        className="w-64 h-64 mx-auto object-cover rounded-md shadow-md"
                      />
                    )}

                    <p className="text-base sm:text-lg font-semibold opacity-90">
                      {slide.productName}
                    </p>
                    <p
                      className="text-sm sm:text-md max-h-14 overflow-hidden text-ellipsis"
                      title={slide.boycottReason}
                    >
                      {slide.boycottReason}
                    </p>
                    <button className="mt-4 bg-[#0E6EFF] hover:bg-[#0c5de0] text-white font-semibold py-2 px-6 rounded shadow transition w-full sm:w-auto mx-auto md:mx-0">
                      View Details
                    </button>
                  </motion.div>

                  {/* Divider */}
                  <div className="hidden md:flex w-px h-80 bg-white/40 mx-10" />

                  {/* Mobile: Recommendation Title */}
                  <div className="md:hidden w-full flex items-center justify-center font-bold text-xl sm:text-2xl mt-8 mb-4 rounded-xl p-2 bg-[#4B0C5D]">
                    Recommendation
                  </div>

                  {/* Right part (Recommendation) */}
                  {slide.recommendation ? (
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="flex-1 flex flex-col justify-center items-center space-y-3 max-w-md text-white"
                    >
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                        {slide.recommendation.productName}
                      </p>
                      <img
                        src={slide.recommendation.productImage}
                        alt={slide.recommendation.productName || 'Recommendation image'}
                        className="w-64 h-64 mx-auto object-cover rounded-md shadow-md"
                      />
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={slide.recommendation.recommenderPhoto}
                          alt={slide.recommendation.recommenderName || 'Recommender photo'}
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
