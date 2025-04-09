
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/cdebb1c4-99a9-4a08-9fe3-47a612c502ff.png" 
                alt="Psicome" 
                className="h-8 w-8"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Providing professional video calling solutions for mental health services.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-psicoblue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-psicoblue transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-psicoblue transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-psicoblue transition-colors">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: info@psicome-connect.com</li>
              <li>Support: support@psicome-connect.com</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Psicome Connect. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-psicoblue">
              Twitter
            </a>
            <a href="#" className="text-gray-500 hover:text-psicoblue">
              LinkedIn
            </a>
            <a href="#" className="text-gray-500 hover:text-psicoblue">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
