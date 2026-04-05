import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../socket';

// Fun emoji array to float around
const emojis = ['🎉', '✨', '🎊', '🚀', '🌟', '🎮', '🦄'];

export default function Home() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [taglineText, setTaglineText] = useState('');
  const fullTagline = "The ultimate multiplayer party game!";
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    
    socket.on('server:roomCreated', ({ roomId }) => {
      navigate(`/host?room=${roomId}`);
    });

    socket.on('server:error', ({ message }) => {
      setError(message);
    });

    // Typewriter effect
    let index = 0;
    const interval = setInterval(() => {
      setTaglineText(fullTagline.slice(0, index));
      index++;
      if (index > fullTagline.length) clearInterval(interval);
    }, 100);

    return () => {
      socket.off('server:roomCreated');
      socket.off('server:error');
      clearInterval(interval);
    };
  }, [navigate]);

  const handleCreateRoom = () => socket.emit('host:createRoom');

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!name || !roomId) {
      setError('Name and Room ID are required');
      return;
    }
    navigate(`/lobby/${roomId}`, { state: { name } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="flex flex-col items-center justify-center w-full relative"
    >
      {/* Background emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {emojis.map((emoji, i) => (
           <motion.div 
             key={i} 
             className="absolute text-4xl opacity-40"
             animate={{
                y: [Math.random() * 20 - 10, Math.random() * -50 - 20],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 10, -10, 0]
             }}
             transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, repeatType: "mirror" }}
             style={{ left: `${10 + Math.random() * 80}%`, top: `${Math.random() * 100}%` }}
           >
             {emoji}
           </motion.div>
        ))}
      </div>

      <motion.h1 
        animate={{ scale: [1, 1.02, 1] }} 
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-7xl md:text-8xl font-black mb-4 title-gradient text-center tracking-tight"
      >
        QuizArena
      </motion.h1>
      
      <p className="text-xl md:text-2xl font-bold mb-12 h-8 text-yellow-100 drop-shadow-md">
        {taglineText}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>|</motion.span>
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl z-10">
        
        {/* Join Panel */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="flex-1 glass-panel p-8"
        >
          <h2 className="text-3xl font-black mb-6 text-center shadow-sm">Join Game</h2>
          <form onSubmit={handleJoinRoom} className="flex flex-col gap-5">
            <input 
              type="text" 
              placeholder="Nickname (e.g. AstroRunner)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/20 border-2 border-white/30 rounded-2xl px-5 py-4 outline-none focus:border-white transition-all text-white placeholder-white/60 font-bold text-lg"
            />
            <input 
              type="text" 
              placeholder="Room Code" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              maxLength={6}
              className="bg-white/20 border-2 border-white/30 rounded-2xl px-5 py-4 outline-none focus:border-white transition-all text-white text-center tracking-[0.3em] font-black text-2xl placeholder-white/50 uppercase"
            />
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-300 font-bold text-center bg-red-900/40 p-2 rounded-lg">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="btn-secondary mt-2 text-2xl uppercase tracking-wider"
            >
              Let's Go!
            </motion.button>
          </form>
        </motion.div>

        {/* Divider */}
        <div className="hidden md:flex flex-col items-center justify-center -mx-4">
          <div className="w-1.5 h-full bg-white/20 rounded-full"></div>
          <div className="py-4 text-white/80 font-black text-xl">OR</div>
          <div className="w-1.5 h-full bg-white/20 rounded-full"></div>
        </div>

        {/* Host Panel */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="flex-1 glass-panel p-8 flex flex-col items-center justify-center text-center"
        >
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-3xl font-black mb-4">Host a Game</h2>
          <p className="text-white/80 mb-8 font-semibold text-lg max-w-xs mx-auto">Create a brand new room and invite your friends to battle!</p>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateRoom} 
            className="btn-primary w-full text-2xl uppercase tracking-wider"
          >
            Create Room
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
