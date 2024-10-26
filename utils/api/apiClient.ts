import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://opdtmbvzevkunhuxvlbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZHRtYnZ6ZXZrdW5odXh2bGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxODA1ODAsImV4cCI6MjA0NDc1NjU4MH0.YImP-g7sTnWMbQSwZ3A35MZ6wSCtbOdfnRS9sSZGu3M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});