
import React from 'react';
import Navigation from '@/components/Navigation';
import MessagingInterface from '@/components/MessagingInterface';

const Messages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20 lg:pb-4">
      <div className="container mx-auto p-4 h-screen">
        <div className="h-full max-h-[calc(100vh-2rem)]">
          <MessagingInterface />
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Messages;
