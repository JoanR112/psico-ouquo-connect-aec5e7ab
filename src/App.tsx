
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VideoCall from "./pages/VideoCall";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookieConsent from "./components/CookieConsent";
import CallInvitation from "./components/CallInvitation";
import { trackPageView } from "./utils/tracking";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Role-specific auth pages
import PatientLoginPage from "./pages/PatientLoginPage";
import PatientSignupPage from "./pages/PatientSignupPage";
import PsychologistLoginPage from "./pages/PsychologistLoginPage";
import PsychologistSignupPage from "./pages/PsychologistSignupPage";
import AuthTypeSelector from "./components/AuthTypeSelector";

const queryClient = new QueryClient();

// Track page views on route changes
const TrackingRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when location changes
    trackPageView();
  }, [location]);
  
  return (
    <>
      <CallInvitation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<AuthTypeSelector />} />
        <Route path="/signup" element={<AuthTypeSelector />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/patient-signup" element={<PatientSignupPage />} />
        <Route path="/psychologist-login" element={<PsychologistLoginPage />} />
        <Route path="/psychologist-signup" element={<PsychologistSignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video" element={<VideoCall />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingRoutes />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
