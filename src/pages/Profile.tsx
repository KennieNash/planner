import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Settings, Shield, Bell, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import NotificationSettings from '@/components/NotificationSettings';
import AccountSecurity from '@/components/AccountSecurity';
import ProviderSettings from '@/components/ProviderSettings';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const location = useLocation();
  const { user, loading, login, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(user);
  const userType = user?.role === 'PROVIDER' ? 'provider' : 'customer';

  const handleProfileUpdate = (updatedData: any) => {
    setUserProfile(prev => ({ ...prev, ...updatedData }));
    // Optionally, update the user in context as well
    if (user) {
      Object.assign(user, updatedData);
    }
    console.log('Profile updated:', updatedData);
  };

  const handlePictureUpdate = (pictureUrl: string) => {
    setUserProfile(prev => ({ ...prev, profilePicture: pictureUrl }));
    if (user) {
      (user as any).profilePicture = pictureUrl;
    }
    console.log('Profile picture updated:', pictureUrl);
  };

  if (!userProfile) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to={userType === 'provider' ? '/provider-dashboard' : '/customer-dashboard'} 
              className="text-white hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
              <p className="text-gray-300">Manage your account and preferences</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-red-400" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="p-4 pb-20 lg:pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {userProfile.profilePicture ? (
                      <img 
                        src={userProfile.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      `${userProfile.firstName[0]}${userProfile.lastName[0]}`
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {userProfile.firstName} {userProfile.lastName}
                  </h2>
                  <p className="text-gray-300">{userProfile.email}</p>
                  {userType === 'provider' && userProfile.company && (
                    <p className="text-blue-400">{userProfile.company}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-400">{userProfile.phone}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">{userProfile.address?.split(',')[1]?.trim()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Settings Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 bg-white/10">
              <TabsTrigger value="personal" className="text-white data-[state=active]:bg-blue-500">
                <User className="w-4 h-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="picture" className="text-white data-[state=active]:bg-blue-500">
                <Camera className="w-4 h-4 mr-2" />
                Picture
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-blue-500">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="text-white data-[state=active]:bg-blue-500">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              {userType === 'provider' && (
                <TabsTrigger value="provider" className="text-white data-[state=active]:bg-blue-500">
                  <Settings className="w-4 h-4 mr-2" />
                  Provider
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="personal">
              <PersonalInfoForm 
                userProfile={userProfile} 
                userType={userType}
                onUpdate={handleProfileUpdate} 
              />
            </TabsContent>
            <TabsContent value="picture">
              <ProfilePictureUpload 
                currentPicture={userProfile.profilePicture}
                onUpdate={handlePictureUpdate}
              />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="security">
              <AccountSecurity />
            </TabsContent>
            {userType === 'provider' && (
              <TabsContent value="provider">
                <ProviderSettings userProfile={userProfile} onUpdate={handleProfileUpdate} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      <div className="lg:hidden">
        <Navigation />
      </div>
    </div>
  );
};

export default Profile;
