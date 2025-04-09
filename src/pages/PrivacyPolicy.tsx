
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">Introduction</h2>
              <p>
                At Psicome Connect, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our video calling services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <p className="mb-3">We may collect information about you in a variety of ways including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, and other identifiers you provide when creating an account or using our services.</li>
                <li><strong>Usage Data:</strong> Information about how you use our website and services, including IP address, browser type, pages visited, time spent on pages, and other analytical data.</li>
                <li><strong>Video Call Data:</strong> When you use our video calling service, we may collect metadata about your calls, such as duration, participants, and technical information needed to facilitate the connection.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our website and hold certain information to enhance your experience.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <p className="mb-3">We may use the information we collect about you for various purposes, including to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative information, such as updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize your experience and deliver content relevant to your interests</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Cookies Policy</h2>
              <p className="mb-3">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. 
                Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p className="mb-3">The types of cookies we use include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization.</li>
                <li><strong>Targeting Cookies:</strong> Record your visit to our website, the pages you visit, and the links you follow.</li>
              </ul>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures to protect the security of any personal information we process. 
                However, please also remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Disclosure of Data</h2>
              <p>We may disclose your personal information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.</li>
                <li><strong>With Your Consent:</strong> We may disclose your personal information for any purpose with your consent.</li>
                <li><strong>Legal Requirements:</strong> To comply with a legal obligation, protect and defend our rights or property, prevent or investigate possible wrongdoing, protect the personal safety of users or the public, and protect against legal liability.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Your Data Protection Rights</h2>
              <p className="mb-3">Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to access, update, or delete your information</li>
                <li>The right to rectification</li>
                <li>The right to object to processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@psicome-connect.com" className="text-psicoblue hover:underline">privacy@psicome-connect.com</a>
              </p>
            </section>

            <p className="text-sm text-gray-500">Last Updated: April 9, 2025</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
