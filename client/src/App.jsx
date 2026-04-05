import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HostDashboard from './pages/HostDashboard';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Results from './pages/Results';
import { motion } from 'framer-motion';

// Soft floating bubbles component for the background
const FloatingBubbles = () => {
  const bubbles = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((_, i) => {
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{ width: size, height: size, left: `${left}%`, bottom: -100 }}
            animate={{
              y: [0, -1000],
              x: [0, Math.random() * 100 - 50, 0]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="animated-bg min-h-screen flex flex-col relative w-full font-sans">
        <FloatingBubbles />
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 z-10 w-full max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/lobby/:roomId" element={<Lobby />} />
            <Route path="/game/:roomId" element={<Game />} />
            <Route path="/results/:roomId" element={<Results />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
