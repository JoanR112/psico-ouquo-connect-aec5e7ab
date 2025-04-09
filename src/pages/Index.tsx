
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video, Shield, Users, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Professional Video Therapy Sessions with{" "}
                <span className="text-psicoblue">Psico</span>
                <span className="ouquo-gradient-text">Ouquo</span>
                <span>Connect</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                A collaboration between Ouquo and Psicome to bring secure, high-quality video call service for mental health professionals and their clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-ouquo-gradient rounded-2xl blur-sm opacity-30 animate-pulse-slow"></div>
                <div className="video-container w-full max-w-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Video className="mx-auto h-12 w-12 mb-3 opacity-80" />
                      <p className="text-lg font-medium">Secure Video Therapy</p>
                      <p className="text-sm opacity-80">Professional. Private. Accessible.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">A Powerful Collaboration</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Combining Psicome's mental health expertise with Ouquo's cutting-edge video technology to create the best therapeutic experience.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="bg-blue-50 p-6 rounded-full inline-flex items-center justify-center mb-4">
                <img 
                  src="/lovable-uploads/cdebb1c4-99a9-4a08-9fe3-47a612c502ff.png" 
                  alt="Psicome" 
                  className="h-20 w-20"
                />
              </div>
              <h3 className="text-xl font-bold text-psicoblue mb-2">Psicome Platform</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                The leading mental health platform connecting therapists with clients seeking professional help.
              </p>
            </div>
            
            <div className="text-3xl font-bold text-gray-400">×</div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-full inline-flex items-center justify-center mb-4">
                <img 
                  src="/lovable-uploads/b6b02843-d7d2-4f3d-bcc6-7400bf3d3a01.png" 
                  alt="Ouquo" 
                  className="h-20 w-20"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">
                <span className="ouquo-gradient-text">Ouquo Video</span>
              </h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Developers of secure, high-quality video communication technology designed for professional settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose PsicoOuquo Connect</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our service combines robust video technology with a user-friendly interface designed specifically for mental health consultations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="text-psicoblue h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                End-to-end encryption and HIPAA compliance ensure your sessions remain private and secure at all times.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Video className="text-psicoblue h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Crystal Clear Quality</h3>
              <p className="text-gray-600">
                High-definition video and adaptive streaming technology for a seamless connection regardless of internet speed.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-psicoblue h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Built for Therapy</h3>
              <p className="text-gray-600">
                Features designed specifically for therapeutic sessions, including mood tracking and session notes.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="text-psicoblue h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Scheduling</h3>
              <p className="text-gray-600">
                Integrated scheduling system allows clients to book appointments directly through the platform.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-gradient-to-r from-blue-100 to-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-psicoblue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Access Control</h3>
              <p className="text-gray-600">
                Therapists can manage access to their virtual rooms and control session recordings and sharing options.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-gradient-to-r from-blue-100 to-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-psicoblue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Session Reminders</h3>
              <p className="text-gray-600">
                Automated reminders help reduce no-shows and keep both therapists and clients on schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-psicoblue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of therapists and clients already using PsicoOuquo Connect for their remote therapy sessions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-white text-psicoblue hover:bg-white/90">
                Log In
              </Button>
            </Link>
            <Link to="/video">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Start Video Session
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
