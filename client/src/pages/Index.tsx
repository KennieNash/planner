
import { useState } from "react";
import { ArrowRight, CheckCircle, Star, Users, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Header */}
      <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">ServiceConnect</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/services" className="text-white hover:text-blue-400 transition-colors">
                Services
              </Link>
              <Link to="/my-requests" className="text-white hover:text-blue-400 transition-colors">
                My Requests
              </Link>
              <Link to="/messages" className="text-white hover:text-blue-400 transition-colors">
                Messages
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-blue-400">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col space-y-2">
                <Link to="/services" className="text-white hover:text-blue-400 transition-colors py-2">
                  Services
                </Link>
                <Link to="/my-requests" className="text-white hover:text-blue-400 transition-colors py-2">
                  My Requests
                </Link>
                <Link to="/messages" className="text-white hover:text-blue-400 transition-colors py-2">
                  Messages
                </Link>
                <Link to="/login" className="text-white hover:text-blue-400 transition-colors py-2">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-blue-400 transition-colors py-2">
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Connect with Local
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {" "}Service Providers
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 animate-fade-in">
            Find trusted professionals for home repairs, cleaning, maintenance, and more. 
            Get multiple quotes and choose the best service for your needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link to="/request-service">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3">
                Request Service
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose ServiceConnect?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We make it easy to find reliable service providers in your area with our comprehensive platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card border border-white/20 animate-slide-in-right">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Verified Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                All service providers are background checked and verified for your safety and peace of mind.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card border border-white/20 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <CardTitle className="text-white">Quick Response</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Get responses from multiple providers within hours, not days. Fast and efficient service matching.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card border border-white/20 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Safe and secure payment processing with protection for both customers and service providers.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Getting the service you need is simple with our streamlined process.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Post Your Request",
              description: "Describe what you need and set your budget"
            },
            {
              step: "2", 
              title: "Receive Quotes",
              description: "Get competitive quotes from verified providers"
            },
            {
              step: "3",
              title: "Choose Provider",
              description: "Compare quotes and select the best option"
            },
            {
              step: "4",
              title: "Get Service",
              description: "Work with your chosen provider to complete the job"
            }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                {item.step}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="glass-card max-w-4xl mx-auto p-12 border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of satisfied customers who found their perfect service provider.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request-service">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3">
                Post a Request
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
                Join as Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">ServiceConnect</h3>
              <p className="text-gray-300 text-sm">
                Connecting you with trusted local service providers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link to="/services" className="hover:text-blue-400">All Services</Link></li>
                <li><Link to="/services" className="hover:text-blue-400">Home Repair</Link></li>
                <li><Link to="/services" className="hover:text-blue-400">Cleaning</Link></li>
                <li><Link to="/services" className="hover:text-blue-400">Maintenance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400">Safety</a></li>
                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 mt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2024 ServiceConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
