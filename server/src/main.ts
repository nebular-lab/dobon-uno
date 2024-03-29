import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const PORT = process.env.PORT || 3001;

app.get('/', (_, res) => {
  res.send(`🚀 Server listening on port:${PORT} 🚀`);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('msg', (msg) => {
    io.emit('msg', msg);
    console.log(`Message sent to everyone: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 SERVER LISTENING ON PORT:${PORT} 🚀`);
});
