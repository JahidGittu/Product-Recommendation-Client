import React, { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import { motion, useAnimation } from "framer-motion";
import Wave from "react-wavify";
import heroImage from "../../../assets/Lotties/Hero.json";
import backgroundImage from "../../../assets/images/HeroBg.png";
import { Link } from "react-router";

// Refactored sentences with before, keyword, after
const sentences = [
  {
    before: "Say ",
    keyword: "Goodbye",
    after: " to Bad Products",
    colors: ["#fa5203", "#eb03fa", "#03a4fa"],
  },
  {
    before: "Welcome to Best ",
    keyword: "Alternatives",
    after: " Products",
    colors: ["#2dd4bf", "#facc15", "#fb7185"],
  },
  {
    before: "Buy Best Alternative and be ",
    keyword: "happy",
    after: "",
    colors: ["#84cc16", "#ec4899", "#3b82f6"],
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const lottieRef = useRef();
  const controls = useAnimation();

  useEffect(() => {
    const { before, keyword, after } = sentences[index];
    const fullText = before + keyword + after;
    let currentIndex = 0;

    setTyped("");

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTyped(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 65);

    const switchTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 7000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(switchTimer);
    };
  }, [index]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5);
      lottieRef.current.play();
    }
  }, []);

  const handleMouseEnter = () => {
    controls.start({
      scale: 1.05,
      y: -5,
      transition: { type: "spring", stiffness: 200 },
    });
  };

  const handleMouseLeave = () => {
    controls.start({
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 150 },
    });
  };

  const renderTypedWithAnimation = () => {
    const { before, keyword, after, colors } = sentences[index];
    const typedLength = typed.length;

    if (typedLength <= before.length) {
      // Typing before keyword
      return <>{typed}</>;
    } else if (typedLength <= before.length + keyword.length) {
      // Typing inside keyword
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
      // Typed full keyword + after part (partial or full)
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
        <h1
          className="text-4xl md:text-5xl font-bold text-black dark:text-accent mb-4"
          aria-live="polite"
        >
          {renderTypedWithAnimation()}
        </h1>

        <p className="text-gray-500 mb-6">
          Share what you don't like. Get suggestions you'll love. A helpful
          community for finding better product alternatives through
          experience-backed advice.
        </p>

        <Link to="/queries">
          <button className="btn btn-primary" aria-label="Explore Queries">
            Explore Queries
          </button>
        </Link>
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
            loop={false}
            autoplay={false}
            style={{ width: "100%" }}
          />
        </motion.div>
      </div>

      <div
        className="absolute -bottom-5 left-0 w-full z-10 overflow-hidden"
        aria-hidden="true"
      >
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
