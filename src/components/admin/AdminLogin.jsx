import { LogIn, Loader2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';

const provider = new GoogleAuthProvider();

export default function AdminLogin({ authLoading }) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className="section-container py-32 flex justify-center">
        <Loader2 className="animate-spin text-brand-blue w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="section-container py-24 md:py-32 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="mb-8 p-6 bg-brand-light rounded-full">
        <LogIn size={40} className="text-brand-blue" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">Admin Access</h1>
      <p className="text-brand-gray mb-2">Sign in with your approved Google account.</p>
      <p className="text-xs text-brand-gray/70 mb-8">Only authorised accounts can access this panel.</p>
      <button
        onClick={handleLogin}
        className="btn-primary flex items-center gap-3 text-lg px-8 py-4"
      >
        Sign in with Google
      </button>
    </div>
  );
}
