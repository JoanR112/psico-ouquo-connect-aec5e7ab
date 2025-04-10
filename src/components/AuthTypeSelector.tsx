
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuthTypeSelector = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/cdebb1c4-99a9-4a08-9fe3-47a612c502ff.png" 
            alt="Psicome" 
            className="h-16 w-16"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to PsicomeConnect</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose how you want to connect to our platform. Are you seeking support or are you a mental health professional?
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">I'm seeking support</CardTitle>
            <CardDescription>Create or access your patient account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <p className="text-center text-gray-600">
              Connect with professional psychologists, schedule sessions, and access support resources.
            </p>
            <div className="flex flex-col space-y-3">
              <Link to="/patient-login">
                <Button className="w-full" variant="outline">Sign in as Patient</Button>
              </Link>
              <Link to="/patient-signup">
                <Button className="w-full">Create Patient Account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">I'm a mental health professional</CardTitle>
            <CardDescription>Create or access your psychologist account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <p className="text-center text-gray-600">
              Provide your professional services, manage your online practice, and connect with patients.
            </p>
            <div className="flex flex-col space-y-3">
              <Link to="/psychologist-login">
                <Button className="w-full" variant="outline">Sign in as Psychologist</Button>
              </Link>
              <Link to="/psychologist-signup">
                <Button className="w-full">Register as Psychologist</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTypeSelector;
