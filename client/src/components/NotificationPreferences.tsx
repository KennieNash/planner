
import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreference {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
}

const NotificationPreferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'new_quotes',
      category: 'Business',
      label: 'New Quote Requests',
      description: 'When customers request quotes for your services',
      email: true,
      push: true,
      sms: true,
      inApp: true
    },
    {
      id: 'messages',
      category: 'Communication',
      label: 'New Messages',
      description: 'When customers send you messages',
      email: true,
      push: true,
      sms: false,
      inApp: true
    },
    {
      id: 'payments',
      category: 'Financial',
      label: 'Payment Notifications',
      description: 'Payment confirmations and payout updates',
      email: true,
      push: true,
      sms: false,
      inApp: true
    },
    {
      id: 'reviews',
      category: 'Reputation',
      label: 'New Reviews',
      description: 'When customers leave reviews for your services',
      email: true,
      push: false,
      sms: false,
      inApp: true
    },
    {
      id: 'appointments',
      category: 'Scheduling',
      label: 'Appointment Reminders',
      description: 'Reminders for upcoming appointments',
      email: false,
      push: true,
      sms: true,
      inApp: true
    },
    {
      id: 'marketing',
      category: 'Marketing',
      label: 'Marketing Updates',
      description: 'Platform updates, tips, and promotional content',
      email: false,
      push: false,
      sms: false,
      inApp: false
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const updatePreference = (id: string, channel: keyof Omit<NotificationPreference, 'id' | 'category' | 'label' | 'description'>, value: boolean) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, [channel]: value } : pref
      )
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Preferences Saved',
      description: 'Your notification preferences have been updated successfully.',
    });
    
    setIsLoading(false);
  };

  const categorizedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = [];
    }
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, NotificationPreference[]>);

  return (
    <div className="space-y-6">
      {/* Sound Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            {soundEnabled ? <Volume2 className="w-5 h-5 mr-2" /> : <VolumeX className="w-5 h-5 mr-2" />}
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Notification Sounds</Label>
              <p className="text-gray-400 text-sm">Play sound when receiving notifications</p>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences by Category */}
      {Object.entries(categorizedPreferences).map(([category, prefs]) => (
        <Card key={category} className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">{category} Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {prefs.map((pref, index) => (
              <div key={pref.id}>
                <div className="mb-4">
                  <h4 className="text-white font-medium">{pref.label}</h4>
                  <p className="text-gray-400 text-sm">{pref.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={pref.email}
                        onCheckedChange={(value) => updatePreference(pref.id, 'email', value)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label className="text-gray-300 text-sm">Email</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={pref.push}
                        onCheckedChange={(value) => updatePreference(pref.id, 'push', value)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label className="text-gray-300 text-sm">Push</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={pref.sms}
                        onCheckedChange={(value) => updatePreference(pref.id, 'sms', value)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label className="text-gray-300 text-sm">SMS</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={pref.inApp}
                        onCheckedChange={(value) => updatePreference(pref.id, 'inApp', value)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label className="text-gray-300 text-sm">In-App</Label>
                    </div>
                  </div>
                </div>
                
                {index < prefs.length - 1 && <Separator className="bg-white/20 mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleSave}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Notification Preferences'}
      </Button>
    </div>
  );
};

export default NotificationPreferences;
