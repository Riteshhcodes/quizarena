import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function Leaderboard({ data }) {
  
  useEffect(() => {
    // Fire a mini confetti pop if we are in the top 3
    if (data.length > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ffe53b', '#ff2525']
      });
    }
  }, [data]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-4xl mx-auto pt-[5vh]"
    >
      <h2 className="text-5xl md:text-6xl font-black mb-12 drop-shadow-lg text-white">Current Standings</h2>
      
      <div className="w-full flex flex-col gap-5">
        {data.map((player, index) => {
          let RankIcon = Minus;
          let rankColor = "text-white/40";
          let bgClass = "bg-white/10 border-white/20";
          
          if (player.rankChange > 0) {
            RankIcon = TrendingUp;
            rankColor = "text-green-300";
          } else if (player.rankChange < 0) {
            RankIcon = TrendingDown;
            rankColor = "text-red-300";
          }

          if (index === 0) {
             bgClass = "bg-gradient-to-r from-yellow-400 to-orange-500 border-white/50 shadow-[0_0_30px_rgba(251,191,36,0.6)] text-white scale-105 z-10 my-4";
          } else if (index === 1) {
             bgClass = "bg-gradient-to-r from-slate-300 to-gray-400 border-white/40 text-gray-900";
          } else if (index === 2) {
             bgClass = "bg-gradient-to-r from-amber-700 to-orange-800 border-white/30 text-white";
          }

          return (
            <motion.div
              key={player.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: (data.length - index) * 0.2 }}
              className={`flex items-center justify-between p-6 md:p-8 rounded-3xl border-2 ${bgClass}`}
            >
              <div className="flex items-center gap-6 md:gap-8">
                <span className={`text-4xl font-black w-10 text-center drop-shadow-sm ${index === 0 ? 'text-white' : ''}`}>
                  {index === 0 ? '👑' : index + 1}
                </span>
                <span className="text-2xl md:text-3xl font-extrabold drop-shadow-sm truncate max-w-[200px] md:max-w-md">{player.name}</span>
              </div>
              
              <div className="flex items-center gap-6 md:gap-10">
                <div className="flex items-center gap-2 min-w-[80px] justify-end">
                  <RankIcon size={28} className={index === 0 ? 'text-white/80' : rankColor} />
                  {player.rankChange !== 0 && (
                    <span className={`font-bold text-xl ${index === 0 ? 'text-white/80' : rankColor}`}>
                      {Math.abs(player.rankChange)}
                    </span>
                  )}
                </div>
                <span className={`font-black text-3xl md:text-5xl tracking-tight w-32 text-right drop-shadow-md ${index > 0 ? 'text-white' : ''}`}>
                   {player.score}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Visual countdown cue */}
      <div className="mt-12 text-center loader-dots text-white/50 font-bold text-2xl uppercase tracking-widest">
         Next Question
      </div>
    </motion.div>
  );
}
