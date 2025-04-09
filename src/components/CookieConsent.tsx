
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // If not consented, show the banner after a small delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Save consent in localStorage
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
    
    // Initialize tracking cookies
    initializeTracking();
  };

  const handleDecline = () => {
    // Save decline preference
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  const initializeTracking = () => {
    // Set a user identifier cookie
    const userId = generateUserId();
    document.cookie = `psicome_user_id=${userId}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Initialize session tracking
    const sessionId = generateSessionId();
    document.cookie = `psicome_session=${sessionId}; path=/; SameSite=Lax`;
    
    // Track page visit
    trackPageView();
  };

  const generateUserId = () => {
    // Generate a pseudo-random user ID
    return 'user_' + Math.random().toString(36).substring(2, 15);
  };

  const generateSessionId = () => {
    // Generate a session ID
    return 'session_' + new Date().getTime() + '_' + Math.random().toString(36).substring(2, 10);
  };

  const trackPageView = () => {
    // Here we would typically send data to an analytics service
    // For now we'll just log to console
    console.log('Page view tracked:', window.location.pathname);
    
    // In a real implementation, you might send this data to your backend
    // Example:
    // fetch('/api/track', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     page: window.location.pathname,
    //     timestamp: new Date().toISOString(),
    //     referrer: document.referrer
    //   })
    // });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 pr-4 max-w-2xl">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">Cookie Consent</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-auto md:hidden" 
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            We use cookies to enhance your experience on our website, analyze site traffic, and personalize content.
            By clicking "Accept", you consent to our use of cookies as described in our{' '}
            <Link to="/privacy-policy" className="text-psicoblue hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
