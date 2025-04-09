
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover how Psicome Connect is revolutionizing online therapy sessions with cutting-edge video technology.
          </p>
        </div>
      </section>
      
      {/* Main Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Video Therapy Sessions</h2>
              <p className="text-gray-700 mb-6">
                Our core service provides a secure, high-quality video platform specifically designed for therapeutic sessions. With end-to-end encryption and HIPAA compliance, both therapists and clients can feel confident in the privacy of their sessions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-psicoblue mr-2 flex-shrink-0 mt-0.5" />
                  <span>HD video and crystal clear audio for natural communication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-psicoblue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Adaptive streaming that works even with unstable internet connections</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-psicoblue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Simple, intuitive interface requiring no technical expertise</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-psicoblue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Works across devices - desktop, tablet, and mobile</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/video">
                  <Button>Try Video Call</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur opacity-20"></div>
              <div className="video-container">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Professional Quality</h3>
                    <p className="opacity-80">
                      Our video quality ensures facial expressions and non-verbal cues are clearly visible - essential elements in effective therapy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional Services */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Additional Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-psicoblue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Appointment Scheduling</h3>
              <p className="text-gray-600 mb-4">
                Integrated calendar system allows therapists to set their availability and clients to book sessions without the need for back-and-forth emails.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Automatic time zone adjustment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Email and SMS reminders</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Recurring session options</span>
                </li>
              </ul>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-psicoblue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
              <p className="text-gray-600 mb-4">
                Tools for therapists and clients to track progress over time, including mood tracking, goal setting, and milestone achievements.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Visual progress charts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Customizable tracking metrics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Exportable reports</span>
                </li>
              </ul>
            </div>
            
            {/* Service 3 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-psicoblue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Messaging</h3>
              <p className="text-gray-600 mb-4">
                End-to-end encrypted messaging system allowing therapists and clients to communicate securely between sessions.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Encrypted file sharing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Message scheduling</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-psicoblue mr-2" />
                  <span className="text-sm">Response time management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Simple, Transparent Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="border rounded-xl p-6 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Basic</h3>
                <p className="text-gray-600 text-sm">For individual practitioners</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Unlimited 1:1 video sessions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Basic appointment scheduling</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Secure messaging</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Standard support</span>
                </li>
              </ul>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">Start Free Trial</Button>
              </Link>
            </div>
            
            {/* Professional Plan */}
            <div className="border-2 border-psicoblue rounded-xl p-6 flex flex-col h-full relative">
              <div className="absolute top-0 right-0 bg-psicoblue text-white py-1 px-3 text-xs font-bold uppercase rounded-tr-lg rounded-bl-lg">
                Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">Professional</h3>
                <p className="text-gray-600 text-sm">For growing practices</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>All Basic features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Group therapy sessions (up to 10)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Advanced scheduling system</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Progress tracking tools</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/login" className="w-full">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="border rounded-xl p-6 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <p className="text-gray-600 text-sm">For clinics & institutions</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>All Professional features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Unlimited group participants</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>Admin dashboard</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-psicoblue mr-2 mt-0.5" />
                  <span>API access</span>
                </li>
              </ul>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">How secure is the video platform?</h3>
              <p className="text-gray-600">
                Our platform uses end-to-end encryption and is fully HIPAA compliant. All data is encrypted in transit and at rest, and we regularly undergo security audits to ensure the highest level of protection for your sessions.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">What devices can I use for video sessions?</h3>
              <p className="text-gray-600">
                Psicome Connect works on most modern devices including desktops, laptops, tablets, and smartphones. We support the latest versions of Chrome, Firefox, Safari, and Edge browsers, as well as our dedicated mobile apps for iOS and Android.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">Do I need to download any software?</h3>
              <p className="text-gray-600">
                No downloads are required when using the web version. Simply access the platform through your browser. For mobile devices, we recommend downloading our app from the App Store or Google Play for the best experience.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">How does billing work?</h3>
              <p className="text-gray-600">
                We offer monthly and annual subscription plans. All plans start with a 14-day free trial, and you can cancel anytime. For therapists, we also provide options to bill clients directly through our platform with integrated payment processing.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">Is technical support available?</h3>
              <p className="text-gray-600">
                Yes, we provide technical support to all users. Basic plans include standard support during business hours, while Professional and Enterprise plans include priority support and extended hours. Enterprise plans also include dedicated support representatives.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-psicoblue-dark to-psicoblue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of mental health professionals already using Psicome Connect to provide exceptional care to their clients.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-white text-psicoblue hover:bg-white/90">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/video">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services;
