
import React, { useState } from 'react';
import { Save, Shield, Eye, EyeOff, Smartphone, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const AccountSecurity = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Password updated');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsLoading(false);
  };

  const handleTwoFactorToggle = async () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    console.log('Two-factor authentication:', !twoFactorEnabled ? 'enabled' : 'disabled');
  };

  const PasswordField = ({ 
    id, 
    label, 
    value, 
    showKey, 
    placeholder 
  }: {
    id: string;
    label: string;
    value: string;
    showKey: keyof typeof showPasswords;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-300">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPasswords[showKey] ? 'text' : 'password'}
          value={value}
          onChange={(e) => handlePasswordChange(id, e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
          placeholder={placeholder}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          onClick={() => togglePasswordVisibility(showKey)}
        >
          {showPasswords[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <PasswordField
              id="currentPassword"
              label="Current Password"
              value={passwordData.currentPassword}
              showKey="current"
              placeholder="Enter your current password"
            />
            
            <PasswordField
              id="newPassword"
              label="New Password"
              value={passwordData.newPassword}
              showKey="new"
              placeholder="Enter your new password"
            />
            
            <PasswordField
              id="confirmPassword"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              showKey="confirm"
              placeholder="Confirm your new password"
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <Label className="text-white font-medium">Enable 2FA</Label>
              <p className="text-gray-400 text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
          
          {twoFactorEnabled && (
            <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30">
              <p className="text-green-400 text-sm">
                ✓ Two-factor authentication is enabled and protecting your account
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <Label className="text-white font-medium">Login Alerts</Label>
              <p className="text-gray-400 text-sm">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white font-medium">Recent Login Activity</Label>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                View All
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Current session - Seattle, WA (Chrome) - Active now</p>
              <p>• Yesterday at 3:42 PM - Seattle, WA (Safari)</p>
              <p>• 3 days ago at 9:15 AM - Seattle, WA (Chrome)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurity;
