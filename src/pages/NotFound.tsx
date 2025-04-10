
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-4">
              <span className="text-5xl font-bold text-red-500">404</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the page you're looking for. The page might have been removed or the URL might be incorrect.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full sm:w-auto flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Link to="/services">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
