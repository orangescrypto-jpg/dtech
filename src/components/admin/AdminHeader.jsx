import { LogOut } from 'lucide-react';

export default function AdminHeader({ user, onLogout }) {
  return (
    <div className="bg-brand-dark text-white px-4 py-3 shadow-lg">
      <div className="section-container flex items-center justify-between mx-auto w-full">
        <div className="flex items-center gap-3">
          <img
            src={user.photoURL}
            alt="Admin"
            className="w-8 h-8 rounded-full border-2 border-brand-cyan"
          />
          <p className="text-sm font-semibold">{user.displayName}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
