import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

// ─── Admin whitelist ────────────────────────────────────────────────────────
// Set VITE_ADMIN_EMAILS in your Vercel env vars (comma-separated).
// e.g.  VITE_ADMIN_EMAILS=alice@gmail.com,bob@gmail.com
// If the variable is not set at all, NO ONE is blocked (open mode).
const RAW = import.meta.env.VITE_ADMIN_EMAILS || '';
const ALLOWED_EMAILS = RAW
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

// If the whitelist is empty/missing → allow everyone (fail open, not fail closed)
const isAdminEmail = (email) => {
  if (ALLOWED_EMAILS.length === 0) return true;
  return ALLOWED_EMAILS.includes(email?.toLowerCase());
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !isAdminEmail(currentUser.email)) {
        // Signed in but not on whitelist — kick out
        await signOut(auth);
        setUser(null);
        alert('Access denied. This Google account is not authorised.');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => { if (auth) await signOut(auth); };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
