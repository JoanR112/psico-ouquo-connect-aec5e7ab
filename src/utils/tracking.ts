// Function to get cookie value by name
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

// Function to set a cookie
export const setCookie = (name: string, value: string, days: number = 365): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

// Track page view
export const trackPageView = (): void => {
  const page = window.location.pathname;
  const referrer = document.referrer;
  const timestamp = new Date().toISOString();
  
  // Get existing user and session IDs or create new ones
  let userId = getCookie('psicome_user_id');
  let sessionId = getCookie('psicome_session');
  
  // If no user ID exists, create one (this should usually be handled in CookieConsent)
  if (!userId && localStorage.getItem('cookieConsent') === 'true') {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    setCookie('psicome_user_id', userId);
  }
  
  // If no session ID exists, create one
  if (!sessionId && localStorage.getItem('cookieConsent') === 'true') {
    sessionId = 'session_' + new Date().getTime() + '_' + Math.random().toString(36).substring(2, 10);
    setCookie('psicome_session', sessionId, 1); // Sessions typically last 1 day
  }
  
  // Log the page view (in a real app, you'd send this to your analytics service)
  console.log('Tracking:', {
    userId,
    sessionId,
    page,
    referrer,
    timestamp
  });
  
  // Record page visit in session storage to track user journey
  recordPageInHistory(page);
};

// Record page in session history
const recordPageInHistory = (page: string): void => {
  try {
    // Get existing history
    const historyString = sessionStorage.getItem('psicome_page_history');
    let history: string[] = [];
    
    if (historyString) {
      history = JSON.parse(historyString);
    }
    
    // Add current page if it's different from the last one
    if (history.length === 0 || history[history.length - 1] !== page) {
      history.push(page);
      // Keep only the last 20 pages
      if (history.length > 20) {
        history = history.slice(history.length - 20);
      }
      sessionStorage.setItem('psicome_page_history', JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error recording page history:', error);
  }
};

// Track user interactions
export const trackEvent = (
  eventCategory: string, 
  eventAction: string, 
  eventLabel?: string, 
  eventValue?: number
): void => {
  // Only track if user has consented
  if (localStorage.getItem('cookieConsent') === 'true') {
    const userId = getCookie('psicome_user_id');
    const sessionId = getCookie('psicome_session');
    
    console.log('Event tracked:', {
      userId,
      sessionId,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      timestamp: new Date().toISOString()
    });
    
    // In a real app, you would send this data to your analytics service
  }
};

// Function to get user journey
export const getUserJourney = (): string[] => {
  try {
    const historyString = sessionStorage.getItem('psicome_page_history');
    if (historyString) {
      return JSON.parse(historyString);
    }
  } catch (error) {
    console.error('Error getting user journey:', error);
  }
  
  return [];
};
