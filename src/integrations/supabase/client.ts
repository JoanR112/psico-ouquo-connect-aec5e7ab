// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ujfcytamrfhjukyikljs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZmN5dGFtcmZoanVreWlrbGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzMwNDIsImV4cCI6MjA2MDQwOTA0Mn0.CTqzvTS64zrE9vFbpkEbjz4i2Vtg7GzkTFDwD4a88nE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);