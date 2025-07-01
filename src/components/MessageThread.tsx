
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  attachment?: {
    url: string;
    name: string;
    type: string;
  };
}

interface Contact {
  id: number;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  role: 'customer' | 'provider';
}

interface MessageThreadProps {
  contact: Contact;
  messages: Message[];
  currentUserId: number;
  onSendMessage: (content: string, type?: string) => void;
  onBack: () => void;
}

const MessageThread = ({ 
  contact, 
  messages, 
  currentUserId, 
  onSendMessage, 
  onBack 
}: MessageThreadProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      onSendMessage(content);
    }
  };

  return (
    <Card className="h-full flex flex-col glass-card">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 lg:hidden"
          >
            ←
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white font-medium">
                {contact.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{contact.name}</h3>
            <p className="text-xs text-gray-300">
              {contact.isOnline ? (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Online
                </span>
              ) : (
                `Last seen ${contact.lastSeen}`
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === currentUserId}
          />
        ))}
        {isTyping && <TypingIndicator isTyping={true} userName={contact.name} />}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="border-t border-white/20">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </Card>
  );
};

export default MessageThread;
