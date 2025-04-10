
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using Psicome Connect, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
                If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="mb-3">
                Psicome Connect provides a secure video calling platform designed specifically for mental health professionals and their clients.
                Our services include but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Secure video calling between mental health professionals and clients</li>
                <li>Scheduling and management of therapy sessions</li>
                <li>Secure messaging between sessions</li>
                <li>Resource sharing and collaborative tools</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="mb-3">
                When you create an account with us, you must provide accurate, complete, and current information at all times.
                Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p>
                You are responsible for safeguarding the password and for all activities that occur under your account.
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and disclose information that pertains to your privacy.
                By accessing or using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Professional Conduct</h2>
              <p>
                Mental health professionals using Psicome Connect must adhere to their respective professional codes of ethics and conduct.
                All users, both professionals and clients, are expected to use the platform with respect and integrity.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Service Availability</h2>
              <p>
                While we strive to provide uninterrupted service, we cannot guarantee that the service will be available at all times.
                We reserve the right to suspend or terminate the service for maintenance or other reasons without prior notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Psicome and its licensors.
                The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p>
                Psicome Connect shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this site.
                Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                <a href="mailto:terms@psicome-connect.com" className="text-psicoblue hover:underline">terms@psicome-connect.com</a>
              </p>
            </section>

            <p className="text-sm text-gray-500">Last Updated: April 10, 2025</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
