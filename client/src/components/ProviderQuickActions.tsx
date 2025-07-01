
import React from 'react';
import { Link } from 'wouter';
import { Download, Calendar, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProviderQuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <Card className="glass-card">
        <CardContent className="p-4">
          <Link to="/calendar">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardContent className="p-4">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardContent className="p-4">
          <Link to="/messages">
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardContent className="p-4">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderQuickActions;
