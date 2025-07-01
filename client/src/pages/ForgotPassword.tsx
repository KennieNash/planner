
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      console.log('Password reset request for:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      
      toast({
        title: "Reset Link Sent!",
        description: "Check your email for password reset instructions.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="glass-card text-white text-center">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
              <p className="text-gray-300 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Try Different Email
                </Button>
                
                <Link to="/login">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/login" className="text-white hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
            <p className="text-gray-300">Reset your account password</p>
          </div>
        </div>

        <Card className="glass-card text-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Reset Password</span>
            </CardTitle>
            <p className="text-gray-300">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-gray-400">
                  Remember your password?{' '}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300">
                    Sign in
                  </Link>
                </p>
                
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-400 hover:text-blue-300">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
