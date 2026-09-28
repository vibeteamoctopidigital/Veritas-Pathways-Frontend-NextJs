import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

const Banner = ({
  image,
  heading,
  description,
  height = "h-[824px] lg:h-[452px]",
  overlay = true,
  children,
}) => {
  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      {/* Background Image */}
      <motion.img
        src={image}
        alt="Banner background"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Overlay */}
      {overlay && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12 md:pb-16">
        <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8">
          
          {/* Left side */}
          <div className="max-w-2xl">
            <AnimatedText
              text={heading}
              className="text-[#F1F1F1] font-inter text-4xl md:text-5xl font-semibold leading-tight"
              delay={0.3}
              as="h1"
            />
          </div>

          {/* Right side */}
          {(description || children) && (
            <motion.div
              className="flex flex-col items-start gap-6 max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              {description && (
                <p className="text-[#FFFFFF] text-lg font-jakarta ">{description}</p>
              )}
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
