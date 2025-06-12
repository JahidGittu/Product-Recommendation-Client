import React, { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import { motion, useAnimation } from "framer-motion";
import Wave from "react-wavify";
import heroImage from "../../../assets/Lotties/Hero.json";
import backgroundImage from "../../../assets/images/HeroBg.png";

// Sentences and their animated keywords
const sentences = [
  {
    text: ["Say ", "Goodbye", " to Bad Products"],
    keywordIndex: 1,
    colors: ["#fa5203", "#eb03fa", "#03a4fa"],
  },
  {
    text: ["Welcome to Best ", "Alternatives", " Products"],
    keywordIndex: 1,
    colors: ["#2dd4bf", "#facc15", "#fb7185"],
  },
  {
    text: ["Buy Best Alternative and be ", "happy", ""],
    keywordIndex: 1,
    colors: ["#84cc16", "#ec4899", "#3b82f6"],
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const lottieRef = useRef();
  const controls = useAnimation();

  useEffect(() => {
    let sentence = sentences[index];
    let fullText = sentence.text.join("");
    let currentIndex = 0;
    let typingInterval;

    setTyped("");

    typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTyped(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 65); // smoother typing

    const switchTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 7000); // stay longer per sentence

    return () => {
      clearInterval(typingInterval);
      clearTimeout(switchTimer);
    };
  }, [index]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  const handleMouseEnter = () => {
    controls.start({ scale: 1.05, y: -5, transition: { type: "spring", stiffness: 200 } });
  };

  const handleMouseLeave = () => {
    controls.start({ scale: 1, y: 0, transition: { type: "spring", stiffness: 150 } });
  };

  const renderTypedWithAnimation = () => {
    const { text, colors } = sentences[index];
    const [before, keyword] = text;

    const typedLength = typed.length;

    if (typedLength < before.length) {
      return <>{typed}</>;
    } else if (typedLength < before.length + keyword.length) {
      return (
        <>
          {before}
          <motion.span
            className="inline-block font-semibold"
            animate={{
              color: colors,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            {typed.slice(before.length)}
          </motion.span>
        </>
      );
    } else {
      return (
        <>
          {before}
          <motion.span
            className="inline-block font-semibold"
            animate={{
              color: colors,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            {keyword}
          </motion.span>
          {typed.slice(before.length + keyword.length)}
        </>
      );
    }
  };

  return (
    <div
      className="min-h-[720px] bg-base-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden z-5"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full md:w-1/2 px-8 md:px-16 text-center md:text-left py-12 z-10 mt-24 md:mt-0">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-accent mb-4">
          {renderTypedWithAnimation()}
        </h1>

        <p className="text-gray-500 mb-6">
          Share what you don't like. Get suggestions you'll love. A helpful
          community for finding better product alternatives through experience-backed advice.
        </p>

        <button className="btn btn-primary">Explore Queries</button>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 z-5">
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
            style={{ width: "100%" }}
          />
        </motion.div>
      </div>

      <div className="absolute -bottom-5 left-0 w-full z-10 overflow-hidden">
        <Wave
          fill="#490C5C"
          paused={false}
          options={{
            height: 20,
            amplitude: 40,
            speed: 0.2,
            points: 8,
          }}
          style={{ opacity: 0.7 }}
        />
      </div>
    </div>
  );
};

export default Hero;
