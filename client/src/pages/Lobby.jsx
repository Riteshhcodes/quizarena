import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../socket';

const funEmojis = ['🦊','🐼','🦁','🐸','🐙','🦖','🦄','🦋','🐯','🐧'];
const avatarColors = [
  'from-pink-400 to-rose-400', 
  'from-cyan-400 to-blue-400',
  'from-emerald-400 to-teal-400',
  'from-amber-400 to-orange-400',
  'from-violet-400 to-purple-400'
];

export default function Lobby() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name;
  
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!name) {
      navigate('/');
      return;
    }

    socket.emit('player:join', { roomId, name });

    socket.on('server:updateLobby', (updatedPlayers) => {
      // Map random emoji + color for new players
      const enrichedPlayers = updatedPlayers.map(p => {
        // Deterministic but "random" assignment based on ID
        const idHash = p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length-1);
        return {
          ...p,
          emoji: funEmojis[idHash % funEmojis.length],
          color: avatarColors[idHash % avatarColors.length]
        };
      });
      setPlayers(enrichedPlayers);
    });

    socket.on('server:nextQuestion', () => {
      navigate(`/game/${roomId}`);
    });

    socket.on('server:error', (error) => {
      alert(error.message);
      navigate('/');
    });

    return () => {
      socket.off('server:updateLobby');
      socket.off('server:nextQuestion');
      socket.off('server:error');
    };
  }, [roomId, name, navigate]);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="flex flex-col items-center justify-center flex-1 w-full"
    >
      <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         className="w-20 h-20 border-8 border-white/20 border-t-yellow-300 rounded-full mb-8 shadow-[0_0_20px_rgba(253,224,71,0.5)]"
      ></motion.div>
      
      <h2 className="text-5xl font-black mb-2 text-center drop-shadow-lg">You're In! 🎉</h2>
      <p className="text-2xl font-bold text-white/80 mb-10 loading-dots">Waiting for Host</p>
      
      <div className="glass-panel p-8 w-full max-w-2xl">
        <h3 className="text-2xl font-black mb-6 text-center text-yellow-100">Players ({players.length})</h3>
        
        <div className="flex flex-wrap justify-center gap-4">
          <AnimatePresence>
            {players.map((p) => (
              <motion.div 
                key={p.id} 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className={`flex items-center gap-2 bg-gradient-to-r ${p.color} px-5 py-3 rounded-full shadow-lg border-2 border-white/40`}
              >
                 <span className="text-2xl">{p.emoji}</span>
                 <span className="font-extrabold text-xl">{p.name}</span>
                 {p.name === name && <span className="bg-white text-black text-xs font-black px-2 py-1 rounded-full ml-2 uppercase">You</span>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
