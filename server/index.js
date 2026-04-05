const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const questions = require('./questions.json');
const roomManager = require('./roomManager');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('host:createRoom', () => {
    const roomId = roomManager.createRoom(socket.id);
    socket.join(roomId);
    socket.emit('server:roomCreated', { roomId });
  });

  socket.on('player:join', ({ roomId, name }) => {
    const result = roomManager.joinRoom(roomId, { id: socket.id, name });
    if (result.error) {
      socket.emit('server:error', { message: result.error });
      return;
    }
    socket.join(roomId);
    // Notify room of updated lobby
    io.to(roomId).emit('server:updateLobby', result.room.players);
  });

  socket.on('host:startGame', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || room.hostId !== socket.id) return;
    
    room.status = 'playing';
    room.currentQuestionIndex = 0;
    sendQuestion(roomId);
  });

  socket.on('player:answer', ({ roomId, answerIndex }) => {
    const room = roomManager.getRoom(roomId);
    if (!room || room.status !== 'playing') return;

    const currentQuestion = questions[room.currentQuestionIndex];
    if (currentQuestion) {
        const isCorrect = answerIndex === currentQuestion.correctAnswer;
        roomManager.calculateScore(roomId, socket.id, isCorrect, room.timer);
        socket.emit('server:answerAck', { isCorrect });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const result = roomManager.removePlayer(socket.id);
    if (result && typeof result === 'object' && result.deletedRoomId) {
      io.to(result.deletedRoomId).emit('server:error', { message: 'Host disconnected. Room closed.' });
    } else if (result && typeof result === 'string') {
      const room = roomManager.getRoom(result);
      if (room) {
        io.to(result).emit('server:updateLobby', room.players);
      }
    }
  });

  function sendQuestion(roomId) {
    const room = roomManager.getRoom(roomId);
    if (!room) return;

    if (room.currentQuestionIndex >= questions.length) {
      // Game Over
      room.status = 'finished';
      const leaderboard = roomManager.getLeaderboard(roomId);
      io.to(roomId).emit('server:gameOver', { leaderboard });
      return;
    }

    const question = questions[room.currentQuestionIndex];
    const questionPayload = {
      question: question.question,
      options: question.options,
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: questions.length
    };

    io.to(roomId).emit('server:nextQuestion', questionPayload);
    
    // Start Timer
    room.timer = 20;
    roomManager.updateRanks(roomId); // Store ranks before this question affects them

    if (room.intervalId) clearInterval(room.intervalId);

    room.intervalId = setInterval(() => {
      room.timer--;
      // emit timer update if needed, but client may just handle UI countdown internally
      
      if (room.timer <= 0) {
        clearInterval(room.intervalId);
        
        // Emitting correct answer
        io.to(roomId).emit('server:timerEnd', { correctAnswer: question.correctAnswer });
        
        // Wait 3 seconds, show leaderboard
        setTimeout(() => {
          const leaderboard = roomManager.getLeaderboard(roomId);
          io.to(roomId).emit('server:updateLeaderboard', { leaderboard });
          
          // Wait 5 seconds on leaderboard, then next question
          setTimeout(() => {
            room.currentQuestionIndex++;
            sendQuestion(roomId);
          }, 5000);
        }, 3000);
      }
    }, 1000);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
