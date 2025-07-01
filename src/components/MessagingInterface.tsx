
import React, { useState } from 'react';
import ContactList from './ContactList';
import MessageThread from './MessageThread';

interface Contact {
  id: number;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  role: 'customer' | 'provider';
  lastMessage?: {
    content: string;
    timestamp: string;
    unreadCount: number;
  };
}

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

const MessagingInterface = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUserId = 1; // This would come from auth context

  // Mock data
  const contacts: Contact[] = [
    {
      id: 1,
      name: 'Sarah Williams',
      isOnline: true,
      role: 'provider',
      lastMessage: {
        content: 'I can start the cleaning tomorrow at 9 AM',
        timestamp: '2024-01-15T10:30:00Z',
        unreadCount: 2
      }
    },
    {
      id: 2,
      name: 'Mike Johnson',
      isOnline: false,
      lastSeen: '2h ago',
      role: 'provider',
      lastMessage: {
        content: 'The plumbing repair is complete',
        timestamp: '2024-01-15T08:15:00Z',
        unreadCount: 0
      }
    },
    {
      id: 3,
      name: 'Emma Garcia',
      isOnline: true,
      role: 'provider',
      lastMessage: {
        content: 'When would you like me to start the garden work?',
        timestamp: '2024-01-14T16:45:00Z',
        unreadCount: 1
      }
    }
  ];

  const messages: Message[] = selectedContact ? [
    {
      id: 1,
      senderId: selectedContact.id,
      content: "Hi! I saw your request for house cleaning. I'd be happy to help.",
      timestamp: '2024-01-15T09:00:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 2,
      senderId: currentUserId,
      content: "Great! What's your availability this week?",
      timestamp: '2024-01-15T09:15:00Z',
      status: 'read',
      type: 'text'
    },
    {
      id: 3,
      senderId: selectedContact.id,
      content: "I can start the cleaning tomorrow at 9 AM. The service will take about 4-5 hours.",
      timestamp: '2024-01-15T10:30:00Z',
      status: 'delivered',
      type: 'text'
    }
  ] : [];

  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);
    // Here you would typically send the message to your backend
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleBack = () => {
    setSelectedContact(null);
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Contact List */}
      <div className={`${selectedContact ? 'hidden lg:block' : 'block'} lg:col-span-1`}>
        <ContactList
          contacts={contacts}
          selectedContactId={selectedContact?.id}
          onSelectContact={handleSelectContact}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Message Thread */}
      <div className={`${selectedContact ? 'block' : 'hidden lg:block'} lg:col-span-2`}>
        {selectedContact ? (
          <MessageThread
            contact={selectedContact}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        ) : (
          <div className="h-full glass-card flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
