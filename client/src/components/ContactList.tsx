
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface ContactListProps {
  contacts: Contact[];
  selectedContactId?: number;
  onSelectContact: (contact: Contact) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ContactList = ({ 
  contacts, 
  selectedContactId, 
  onSelectContact, 
  searchTerm, 
  onSearchChange 
}: ContactListProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full glass-card">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Messages</CardTitle>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-400">
              {searchTerm ? 'No conversations found.' : 'No messages yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`p-4 cursor-pointer transition-colors hover:bg-white/10 ${
                  selectedContactId === contact.id ? 'bg-white/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      {contact.avatar ? (
                        <img 
                          src={contact.avatar} 
                          alt={contact.name} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white truncate">{contact.name}</h4>
                      <div className="flex items-center space-x-2">
                        {contact.lastMessage && (
                          <span className="text-xs text-gray-400">
                            {formatTime(contact.lastMessage.timestamp)}
                          </span>
                        )}
                        {contact.lastMessage?.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                            {contact.lastMessage.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-300 truncate">
                        {contact.lastMessage?.content || 'No messages yet'}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          contact.role === 'provider' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {contact.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactList;
