
import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 border-t border-white/20 p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500 pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white border-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
