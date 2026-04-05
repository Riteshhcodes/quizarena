import { motion, AnimatePresence } from 'framer-motion';

export default function Timer({ seconds, isFinished }) {
  // Timer color threshold
  let strokeColor = "rgba(67, 233, 123, 1)"; // Green
  let glowColor = "rgba(67, 233, 123, 0.5)";
  
  if (seconds <= 10 && seconds > 5) {
    strokeColor = "rgba(250, 112, 154, 1)"; // Pink/Orange
    glowColor = "rgba(250, 112, 154, 0.5)";
  } else if (seconds <= 5) {
    strokeColor = "rgba(255, 37, 37, 1)"; // Red
    glowColor = "rgba(255, 37, 37, 0.6)";
  }

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isFinished ? 0 : circumference * (1 - seconds / 20);

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        animate={seconds <= 5 && !isFinished ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="relative w-20 h-20 flex items-center justify-center font-bold"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-xl" style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}>
          <circle
            cx="40" cy="40" r={radius}
            fill="rgba(0,0,0,0.2)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="8"
          />
          <motion.circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <span className="text-3xl font-black tabular-nums tracking-tighter" style={{ color: "white", textShadow: "0 2px 5px rgba(0,0,0,0.5)" }}>
          {seconds}
        </span>
      </motion.div>
    </div>
  );
}
