
import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  className?: string;
}

const MessageStatus = ({ status, className = '' }: MessageStatusProps) => {
  switch (status) {
    case 'sending':
      return <Clock className={`w-4 h-4 text-gray-400 ${className}`} />;
    case 'sent':
      return <Check className={`w-4 h-4 text-gray-400 ${className}`} />;
    case 'delivered':
      return <CheckCheck className={`w-4 h-4 text-gray-400 ${className}`} />;
    case 'read':
      return <CheckCheck className={`w-4 h-4 text-blue-400 ${className}`} />;
    case 'failed':
      return <AlertCircle className={`w-4 h-4 text-red-400 ${className}`} />;
    default:
      return null;
  }
};

export default MessageStatus;
