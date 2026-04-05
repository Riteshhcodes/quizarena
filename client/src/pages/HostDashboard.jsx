import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../socket';

export default function HostDashboard() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    socket.on('server:updateLobby', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('server:error', ({ message }) => {
      alert(message);
    });

    socket.on('server:nextQuestion', () => {
      navigate(`/game/${roomId}?host=true`);
    });

    return () => {
      socket.off('server:updateLobby');
      socket.off('server:error');
      socket.off('server:nextQuestion');
    };
  }, [roomId, navigate]);

  const handleStartGame = () => {
    if (players.length === 0) {
      alert("Need at least 1 player to start!");
      return;
    }
    socket.emit('host:startGame', { roomId });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center flex-1 w-full max-w-4xl"
    >
      <h2 className="text-4xl md:text-5xl font-black mb-8 drop-shadow-xl">Host Dashboard 🎮</h2>
      
      <div className="bg-white/20 border-4 border-white/50 rounded-[40px] px-12 py-8 mb-10 text-center shadow-[0_0_50px_rgba(255,255,255,0.2)] backdrop-blur-md">
        <p className="text-yellow-100 mb-2 uppercase tracking-[0.3em] font-extrabold text-sm">Join with this code</p>
        <p className="text-7xl md:text-8xl font-black tracking-[0.2em] font-mono text-white drop-shadow-md">{roomId}</p>
      </div>

      <div className="w-full glass-panel p-8 mb-10 min-h-[250px]">
        <div className="flex justify-between items-center mb-6 border-b-2 border-white/20 pb-4">
          <h3 className="text-3xl font-black">Lobby</h3>
          <span className="bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-lg font-black shadow-inner">
            {players.length} / 50
          </span>
        </div>
        
        {players.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-white/50 h-full">
            <div className="w-16 h-16 border-8 border-white/10 border-t-white/60 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-bold animate-pulse">Waiting for players to join...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            <AnimatePresence>
              {players.map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                  className="bg-white/20 px-6 py-3 rounded-full text-xl font-extrabold shadow-md border-2 border-white/30"
                >
                  {p.name}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <motion.button 
        whileHover={players.length > 0 ? { scale: 1.05 } : {}}
        whileTap={players.length > 0 ? { scale: 0.95 } : {}}
        onClick={handleStartGame} 
        disabled={players.length === 0}
        className={`btn-primary w-full max-w-lg text-3xl uppercase tracking-widest ${players.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
      >
        Start Game
      </motion.button>
    </motion.div>
  );
}
