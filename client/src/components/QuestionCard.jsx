import { motion } from 'framer-motion';

export default function QuestionCard({ question, options, lockedAnswer, correctAnswer, onSelect, disabled }) {
  
  const getButtonStyles = (index) => {
    // Defined gradients for options
    const gradients = [
      "linear-gradient(135deg, var(--color-btn-a-1), var(--color-btn-a-2))",
      "linear-gradient(135deg, var(--color-btn-b-1), var(--color-btn-b-2))",
      "linear-gradient(135deg, var(--color-btn-c-1), var(--color-btn-c-2))",
      "linear-gradient(135deg, var(--color-btn-d-1), var(--color-btn-d-2))"
    ];

    if (correctAnswer !== null) {
      if (index === correctAnswer) {
        return { 
          bg: "linear-gradient(135deg, #43e97b, #38f9d7)", 
          shadow: "0 0 25px rgba(67, 233, 123, 0.8)", 
          scale: 1.05, 
          opacity: 1,
          textColor: "text-white"
        };
      } else if (index === lockedAnswer) {
        return { 
          bg: gradients[index], 
          shadow: "none", 
          scale: 0.95, 
          opacity: 0.4,
          textColor: "text-gray-800"
        };
      } else {
        return { 
          bg: "rgba(255,255,255,0.1)", 
          shadow: "none", 
          scale: 0.95, 
          opacity: 0.3,
          textColor: "text-white"
        };
      }
    } else if (lockedAnswer !== null) {
       if (index === lockedAnswer) {
         return { 
           bg: gradients[index], 
           shadow: `0 0 20px ${gradients[index].split(',')[1]}`, 
           scale: 1.02, 
           opacity: 1,
           textColor: "text-gray-800"
         };
       } else {
         return { 
           bg: "rgba(255,255,255,0.2)", 
           shadow: "none", 
           scale: 0.98, 
           opacity: 0.5,
           textColor: "text-white"
         };
       }
    } else if (disabled) {
       return { 
         bg: gradients[index], 
         shadow: "none", 
         scale: 1, 
         opacity: 0.5,
         textColor: "text-gray-800"
       };
    }
    
    // Default active state
    return {
      bg: gradients[index],
      shadow: `0 4px 15px rgba(0,0,0,0.1)`,
      scale: 1,
      opacity: 1,
      textColor: "text-gray-800 hover:text-black"
    };
  };

  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      <motion.div 
        key={question} // force re-render animation on new question
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass-panel p-8 md:p-12 mb-6"
      >
        <h2 className="text-3xl md:text-5xl font-black text-center leading-tight drop-shadow-md text-white">{question}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {options.map((option, index) => {
          const style = getButtonStyles(index);
          const isCorrect = correctAnswer !== null && index === correctAnswer;
          const isWrong = correctAnswer !== null && index === lockedAnswer && index !== correctAnswer;

          return (
            <motion.button
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: style.scale, 
                opacity: style.opacity,
                x: isWrong ? [0, -10, 10, -10, 10, 0] : 0 // Shake effect if wrong
              }}
              whileHover={disabled || lockedAnswer !== null ? {} : { scale: 1.05, filter: "brightness(1.1)" }}
              transition={{ 
                duration: isWrong ? 0.4 : 0.2, 
                delay: isWrong || isCorrect ? 0 : index * 0.1 
              }}
              disabled={disabled || lockedAnswer !== null}
              onClick={() => onSelect(index)}
              style={{ background: style.bg, boxShadow: style.shadow }}
              className={`p-6 md:p-8 rounded-2xl flex items-center gap-4 border-2 border-white/20 relative overflow-hidden`}
            >
              {/* Option Letter Bubble */}
              <span className={`w-10 h-10 shrink-0 rounded-full bg-white/40 flex justify-center items-center font-black text-xl shadow-inner ${style.textColor}`}>
                {String.fromCharCode(65 + index)}
              </span>
              
              <span className={`text-2xl font-extrabold flex-1 text-left drop-shadow-sm ${style.textColor}`}>
                {option}
              </span>

              {/* Status Icons */}
              {lockedAnswer === index && correctAnswer === null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} className="text-3xl">🎯</motion.div>
              )}
              {isCorrect && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-6 text-5xl">✅</motion.div>
              )}
              {isWrong && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-6 text-5xl">😬</motion.div>
              )}
              
              {/* Correct Burst Overlay */}
              {isCorrect && (
                 <motion.div 
                   initial={{ scale: 0, opacity: 0.8 }} 
                   animate={{ scale: 3, opacity: 0 }} 
                   transition={{ duration: 0.8 }}
                   className="absolute inset-0 bg-white rounded-2xl pointer-events-none"
                 />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
