import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import goodbuy from '../../../assets/images/goodbuy.gif';

const AnimatedImage = () => {
  const controls = useAnimation();

  useEffect(() => {
    const showImage = () => {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 1 },
      });

      setTimeout(() => {
        controls.start({
          opacity: 0,
          scale: 0.5,
          transition: { duration: 1 },
        });
      }, 5000); // visible for 2 seconds
    };

    showImage(); // run initially

    const interval = setInterval(() => {
      showImage();
    }, 5000); // every 1 minute

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <motion.img
      src={goodbuy}
      alt="Goodbye"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={controls}
      className="absolute w-12 h-12 right-5 top-10 md:right-2/5"
    />
  );
};

export default AnimatedImage;
