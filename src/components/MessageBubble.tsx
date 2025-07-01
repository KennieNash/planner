
import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: number;
    senderId: number;
    content: string;
    timestamp: string;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'file';
  };
  isOwnMessage: boolean;
  senderName?: string;
}

const MessageBubble = ({ message, isOwnMessage, senderName }: MessageBubbleProps) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {!isOwnMessage && senderName && (
          <p className="text-xs text-gray-400 mb-1 px-3">{senderName}</p>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white/20 text-white rounded-bl-md'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
            {isOwnMessage && getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
