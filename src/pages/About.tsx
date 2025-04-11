
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Psicome Connect</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Learn more about how Psicome created a secure, professional video calling platform for mental health services.
          </p>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Psicome Connect began with a vision: to create a video calling platform specifically designed for mental health professionals and their clients. We recognized that general-purpose video platforms weren't meeting the unique needs of therapeutic relationships.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              With our deep understanding of mental health services and therapeutic relationships, we developed Psicome Connect - a platform that combines clinical expertise with technological innovation.
            </p>
            <p className="text-gray-700 text-lg">
              Today, Psicome Connect serves thousands of mental health professionals worldwide, enabling them to deliver effective therapy remotely while maintaining the personal connection essential to successful treatment.
            </p>
          </div>
        </div>
      </section>
      
      {/* Company Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">About Psicome</h2>
          
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="bg-blue-50 p-8 rounded-full mb-6">
              <img 
                src="/lovable-uploads/cdebb1c4-99a9-4a08-9fe3-47a612c502ff.png" 
                alt="Psicome" 
                className="h-32 w-32"
              />
            </div>
            <h3 className="text-2xl font-bold text-psicoblue mb-3">Psicome</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Psicome is a leading mental health platform that connects therapists with clients seeking help. With a focus on accessibility and quality care, Psicome has revolutionized how people access mental health services through its innovative matching system, secure client management tools, and now with Psicome Connect, high-quality video therapy.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 mb-10">
              To make quality mental health care accessible to everyone by providing therapists and clients with secure, reliable, and user-friendly video communication tools designed specifically for therapeutic interactions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-3">Accessibility</h3>
                <p className="text-gray-700">
                  Breaking down geographical barriers to ensure everyone can access the mental health support they need, regardless of location.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Security</h3>
                <p className="text-gray-700">
                  Maintaining the highest standards of privacy and data protection to foster trust and confidentiality in every session.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-700">
                  Continuously improving our platform based on feedback from therapists and clients to meet the evolving needs of mental health care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Leadership Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Leadership</h2>
          
          <div className="flex justify-center">
            {/* Joan Rotllan */}
            <div className="text-center max-w-xs">
              <div className="mx-auto rounded-full bg-gray-100 mb-6 overflow-hidden w-56 h-56">
                <img 
                  src="/lovable-uploads/b6b02843-d7d2-4f3d-bcc6-7400bf3d3a01.png" 
                  alt="Joan Rotllan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Joan Rotllan</h3>
              <p className="text-sm text-gray-600 mt-2">CEO & Founder, Psicome</p>
              <p className="mt-4 text-gray-700 px-4">
                Visionary founder who created Psicome with the mission to transform mental healthcare accessibility through technology.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="bg-gradient-to-r from-psicoblue-dark to-psicoblue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Privacy First</h3>
                <p className="text-white/80">
                  We believe that confidentiality is the foundation of effective therapy. Every feature and update is designed with privacy as our top priority.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">User-Centered Design</h3>
                <p className="text-white/80">
                  We create intuitive, accessible tools that enhance the therapeutic relationship rather than getting in the way.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Continuous Improvement</h3>
                <p className="text-white/80">
                  We're committed to ongoing research and development to ensure our platform evolves with the needs of mental health professionals and their clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
