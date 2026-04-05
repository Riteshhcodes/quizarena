import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const leaderboard = location.state?.leaderboard || [];

  useEffect(() => {
    // Ultimate celebration confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const winner = leaderboard.length > 0 ? leaderboard[0] : null;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto pt-10">
      
      <motion.div 
         initial={{ scale: 0, rotate: -180 }}
         animate={{ scale: 1, rotate: 0 }}
         transition={{ type: "spring", stiffness: 100, damping: 10 }}
         className="text-[120px] mb-4 leading-none relative z-10"
      >
        🏆
      </motion.div>
      
      <h2 className="text-5xl md:text-7xl font-black mb-6 text-center drop-shadow-xl text-white">Game Over!</h2>
      
      {winner && (
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl mb-16 font-extrabold text-center"
        >
          <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-sm">
            {winner.name} Wins!
          </span>
        </motion.p>
      )}

      {/* 3D Podium Layout for Top 3 */}
      <div className="flex items-end justify-center gap-2 md:gap-6 w-full h-[300px] mb-16">
         {/* Second Place */}
         {leaderboard[1] && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: '60%', opacity: 1 }}
             transition={{ delay: 1.5, type: 'spring' }}
             className="w-1/3 max-w-[200px] bg-gradient-to-t from-slate-400 to-slate-200 rounded-t-3xl border-t-8 border-slate-100 flex flex-col items-center justify-start pt-6 relative shadow-2xl"
           >
             <span className="text-4xl absolute -top-12">🥈</span>
             <span className="font-black text-2xl text-slate-900 truncate px-4 w-full text-center">{leaderboard[1].name}</span>
             <span className="font-extrabold text-xl text-slate-700 bg-white/50 px-4 py-1 rounded-full mt-2">{leaderboard[1].score}</span>
           </motion.div>
         )}

         {/* First Place */}
         {leaderboard[0] && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: '100%', opacity: 1 }}
             transition={{ delay: 2.5, type: 'spring' }}
             className="w-1/3 max-w-[220px] bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-3xl border-t-8 border-yellow-200 flex flex-col items-center justify-start pt-8 relative shadow-2xl z-10"
           >
             <span className="text-6xl absolute -top-16 bounce">👑</span>
             <span className="font-black text-3xl text-yellow-900 truncate px-4 w-full text-center drop-shadow-sm">{leaderboard[0].name}</span>
             <span className="font-extrabold text-2xl text-yellow-900 bg-white/50 px-5 py-2 rounded-full mt-4 shadow-sm">{leaderboard[0].score}</span>
           </motion.div>
         )}

         {/* Third Place */}
         {leaderboard[2] && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: '45%', opacity: 1 }}
             transition={{ delay: 1, type: 'spring' }}
             className="w-1/3 max-w-[200px] bg-gradient-to-t from-orange-800 to-amber-600 rounded-t-3xl border-t-8 border-amber-500 flex flex-col items-center justify-start pt-6 relative shadow-2xl"
           >
             <span className="text-4xl absolute -top-12">🥉</span>
             <span className="font-black text-2xl text-white truncate px-4 w-full text-center drop-shadow-sm">{leaderboard[2].name}</span>
             <span className="font-extrabold text-xl text-white bg-black/20 px-4 py-1 rounded-full mt-2">{leaderboard[2].score}</span>
           </motion.div>
         )}
      </div>

      <motion.button 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 4 }}
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         onClick={() => navigate('/')} 
         className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black text-3xl px-12 py-5 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.5)] border-4 border-white/20"
      >
        Play Again!
      </motion.button>
    </div>
  );
}
