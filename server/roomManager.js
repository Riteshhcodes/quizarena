class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomCode() {
    let code;
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(hostId) {
    const roomId = this.generateRoomCode();
    this.rooms.set(roomId, {
      id: roomId,
      hostId,
      status: 'waiting', // waiting, playing, finished
      players: [],
      currentQuestionIndex: -1,
      timer: 20,
      intervalId: null
    });
    return roomId;
  }

  joinRoom(roomId, player) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'Room not found' };
    if (room.status !== 'waiting') return { error: 'Game has already started' };
    
    room.players.push({
      id: player.id,
      name: player.name,
      score: 0,
      lastAnswerTime: null,
      lastRank: null
    });
    return { room };
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  removePlayer(playerId) {
    for (const [roomId, room] of this.rooms.entries()) {
      const initialLength = room.players.length;
      room.players = room.players.filter(p => p.id !== playerId);
      if (room.players.length < initialLength) {
         if (room.players.length === 0 && room.hostId !== playerId) {
            // Room empty, but let host keep it maybe? Actually if everyone leaves, maybe close room. 
            // We can leave it for now.
         }
         return roomId;
      }
      if (room.hostId === playerId) {
        // Host disconnected
        this.rooms.delete(roomId);
        return { deletedRoomId: roomId };
      }
    }
    return null;
  }

  calculateScore(roomId, playerId, isCorrect, timeRemaining) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    const player = room.players.find(p => p.id === playerId);
    if (!player) return;

    if (isCorrect) {
      // Base score 1000, speed bonus up to 1000 based on time limit (20s)
      const speedBonus = Math.floor((timeRemaining / 20) * 1000);
      player.score += (1000 + speedBonus);
    }
  }

  updateRanks(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.players.forEach((p, idx) => {
      // Find their current rank by sorting
      const sorted = [...room.players].sort((a, b) => b.score - a.score);
      const currentRank = sorted.findIndex(s => s.id === p.id);
      p.lastRank = currentRank;
    });
  }

  getLeaderboard(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    
    // Create deep copy before sorting to avoid mutating original order if we cared
    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    return sorted.map((p, index) => ({
      id: p.id,
      name: p.name,
      score: p.score,
      rank: index + 1,
      rankChange: p.lastRank !== null && p.lastRank !== undefined ? p.lastRank - index : 0
    }));
  }
}

module.exports = new RoomManager();
