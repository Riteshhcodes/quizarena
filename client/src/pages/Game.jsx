import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import Timer from '../components/Timer';
import Leaderboard from '../components/Leaderboard';
import QuestionCard from '../components/QuestionCard';

export default function Game() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const isHost = searchParams.get('host') === 'true';
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState(null);
  const [timer, setTimer] = useState(20);
  const [lockedAnswer, setLockedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    socket.on('server:nextQuestion', (data) => {
      setQuestionData(data);
      setTimer(20);
      setLockedAnswer(null);
      setCorrectAnswer(null);
      setShowLeaderboard(false);
    });

    socket.on('server:timerEnd', ({ correctAnswer }) => {
      setCorrectAnswer(correctAnswer);
    });

    socket.on('server:updateLeaderboard', ({ leaderboard }) => {
      setLeaderboardData(leaderboard);
      setShowLeaderboard(true);
    });

    socket.on('server:gameOver', ({ leaderboard }) => {
      navigate(`/results/${roomId}`, { state: { leaderboard, isHost } });
    });

    return () => {
      socket.off('server:nextQuestion');
      socket.off('server:timerEnd');
      socket.off('server:updateLeaderboard');
      socket.off('server:gameOver');
    };
  }, [roomId, navigate, isHost]);

  useEffect(() => {
    if (showLeaderboard || correctAnswer !== null) return;
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [showLeaderboard, correctAnswer]);

  const handleAnswer = (index) => {
    if (lockedAnswer !== null || correctAnswer !== null || isHost) return;
    setLockedAnswer(index);
    socket.emit('player:answer', { roomId, answerIndex: index });
  };

  if (!questionData) return (
    <div className="flex-1 flex flex-col items-center justify-center">
       <div className="w-20 h-20 border-8 border-white/20 border-t-yellow-300 rounded-full animate-spin mb-6"></div>
       <h2 className="text-3xl font-black">Get Ready...</h2>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 w-full relative pt-[4vh]">
      {showLeaderboard ? (
        <Leaderboard data={leaderboardData} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-10 border-b-2 border-white/10 pb-6 w-full max-w-5xl mx-auto px-4">
            <div className="glass-panel px-6 py-3 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
               <span className="text-yellow-200 font-black text-2xl uppercase tracking-widest">
                 Q {questionData.questionNumber} <span className="text-white/50 text-xl">/ {questionData.totalQuestions}</span>
               </span>
            </div>
            <Timer seconds={timer} isFinished={correctAnswer !== null} />
          </div>

          <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-2">
             <QuestionCard 
                question={questionData.question}
                options={questionData.options}
                lockedAnswer={lockedAnswer}
                correctAnswer={correctAnswer}
                onSelect={handleAnswer}
                disabled={isHost || lockedAnswer !== null || correctAnswer !== null}
             />
          </div>
          {isHost && (
            <div className="mt-8 text-center bg-black/30 w-fit mx-auto px-6 py-2 rounded-full text-white/50 font-black uppercase tracking-[0.3em] backdrop-blur-md">
              Host View Screen
            </div>
          )}
        </>
      )}
    </div>
  );
}
