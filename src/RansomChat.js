import React, { useState, useEffect } from 'react';
import { Send, Clock } from 'lucide-react';

const RansomChat = ({ companyName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const randomResponses = [
    "We do not accept negotiations. The payment must be made in full.",
    "Time is running out. Every hour of delay increases the ransom amount.",
    "Your data is safe... for now. Do not test our patience.",
    "We have access to highly sensitive information. Do you really want it to be made public?",
    "Other companies paid without hesitation. Why waste time?",
    "Our demands are reasonable considering the value of your data.",
    "We can provide you with a decrypted data sample as proof of our good faith.",
    "Payment in Bitcoin is non-negotiable. It's in your best interest to cooperate quickly.",
    "Our systems are automated. Non-payment will result in the destruction of your data.",
    "We honor our commitments. Payment guarantees the recovery of your data."
  ];
  

  useEffect(() => {
    const initialMessage = {
      sender: 'ransomware',
      content: `Your data has been encrypted. To recover the decryption key, you must pay the total amount within the next 48 hours.`,
      timestamp: new Date().toISOString()
    };
    setMessages([initialMessage]);
  }, []);

  const getRandomResponse = () => {
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        sender: 'victim',
        content: input.trim(),
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      setInput('');
      
      // Simuler une réponse automatique avec un délai aléatoire
      const delay = Math.floor(Math.random() * 2000) + 1000; // Entre 1 et 3 secondes
      setTimeout(() => {
        const autoResponse = {
          sender: 'ransomware',
          content: getRandomResponse(),
          timestamp: new Date().toISOString()
        };
        setMessages(msgs => [...msgs, autoResponse]);
      }, delay);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-red-500 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-red-500">Communication avec {companyName}</h2>
      <div className="h-64 overflow-y-auto mb-4 bg-gray-800 p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'ransomware' ? 'text-red-400' : 'text-blue-400'}`}>
            <span className="font-bold">{msg.sender === 'ransomware' ? 'Ransomware Group' : 'You'}: </span>
            {msg.content}
            <span className="text-xs text-gray-500 ml-2">
              <Clock className="inline w-3 h-3 mr-1" />
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-gray-700 text-white p-2 rounded-l"
          placeholder="Type in your message..."
        />
        <button onClick={handleSend} className="bg-red-500 text-white p-2 rounded-r">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RansomChat;