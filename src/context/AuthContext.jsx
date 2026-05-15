import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

// ─── Admin whitelist ────────────────────────────────────────────────────────
// Set VITE_ADMIN_EMAILS in your .env (comma-separated).
// e.g.  VITE_ADMIN_EMAILS=alice@gmail.com,bob@gmail.com
const ALLOWED_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email) =>
  ALLOWED_EMAILS.length > 0 && ALLOWED_EMAILS.includes(email?.toLowerCase());

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
        // Signed in but not whitelisted — kick them out immediately
        await signOut(auth);
        setUser(null);
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
