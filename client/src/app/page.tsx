'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const baseURL: string = process.env.NEXT_PUBLIC_API_URL || '';
const timeout: number = 100 * 1000;

const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const socket = io(url);

export default function Home() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  const sendMessage = () => {
    socket.emit('msg', message);
    setMessage('');
  };

  useEffect(() => {
    socket.on('msg', (msg: string) => {
      setReceivedMessages((prevMessages: string[]) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('msg');
    };
  }, []);

  return (
    <main>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="メッセージを入力"
        className="mb-4 border-2 border-gray-300 p-2"
      />
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={sendMessage}
        className="mb-4 rounded bg-blue-500 py-2 px-4 text-white"
      >
        送信
      </button>
      <div>
        {receivedMessages.map((msg, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <p key={index}>{msg}</p>
        ))}
      </div>
    </main>
  );
}
