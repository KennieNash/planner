
import React, { useState } from 'react';
import { Upload, Camera, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfilePictureUploadProps {
  currentPicture: string | null;
  onUpdate: (pictureUrl: string) => void;
}

const ProfilePictureUpload = ({ currentPicture, onUpdate }: ProfilePictureUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPicture);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would upload to your storage service
    // For now, we'll just use the preview URL
    onUpdate(preview);
    setIsUploading(false);
  };

  const handleRemovePicture = () => {
    setPreviewUrl(null);
    onUpdate('');
  };

  const triggerFileInput = () => {
    document.getElementById('profile-picture-input')?.click();
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Current/Preview Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16" />
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          {/* Upload Guidelines */}
          <div className="text-center text-gray-300 text-sm">
            <p>Recommended: Square image, at least 200x200 pixels</p>
            <p>Maximum file size: 5MB</p>
            <p>Supported formats: JPG, PNG, GIF</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={triggerFileInput}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isUploading}
            >
              <Camera className="w-4 h-4 mr-2" />
              {previewUrl ? 'Change Picture' : 'Upload Picture'}
            </Button>

            {previewUrl && (
              <Button
                onClick={handleRemovePicture}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                disabled={isUploading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Upload Area */}
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-white/5 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-2">Click to upload or drag and drop</p>
          <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 5MB</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
