
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageInput from '@/components/MessageInput';

interface ChatProps {
  conversation: {
    id: number;
    requestId: number;
    requestTitle: string;
    providerName: string;
    providerAvatar: string;
    isOnline: boolean;
    status: string;
  };
  onBack: () => void;
}

const Chat = ({ conversation, onBack }: ChatProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 'provider',
      senderName: conversation.providerName,
      content: 'Hello! I saw your plumbing request. I can help you with that kitchen sink blockage.',
      timestamp: '2024-01-15T10:00:00Z',
      type: 'text'
    },
    {
      id: 2,
      senderId: 'client',
      senderName: 'You',
      content: 'Great! How soon can you come? The water is still overflowing.',
      timestamp: '2024-01-15T10:05:00Z',
      type: 'text'
    },
    {
      id: 3,
      senderId: 'provider',
      senderName: conversation.providerName,
      content: 'I can be there in 2 hours. I\'ll bring all the necessary equipment. My quote includes everything needed for the repair.',
      timestamp: '2024-01-15T10:10:00Z',
      type: 'text'
    },
    {
      id: 4,
      senderId: 'client',
      senderName: 'You',
      content: 'Perfect! I\'ll accept your quote. What\'s your ETA?',
      timestamp: '2024-01-15T10:15:00Z',
      type: 'text'
    },
    {
      id: 5,
      senderId: 'provider',
      senderName: conversation.providerName,
      content: 'I can be there in 2 hours. Is that okay?',
      timestamp: '2024-01-15T16:30:00Z',
      type: 'text'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: messages.length + 1,
      senderId: 'client',
      senderName: 'You',
      content,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages([...messages, newMessage]);
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="backdrop-blur-md bg-white/10 border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="relative">
              <img
                src={conversation.providerAvatar}
                alt={conversation.providerName}
                className="w-10 h-10 rounded-full bg-white/20"
              />
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
              )}
            </div>
            
            <div>
              <h2 className="text-white font-semibold">{conversation.providerName}</h2>
              <p className="text-sm text-gray-300">{conversation.requestTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === 'client'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === 'client' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
