
import React, { useState } from 'react';
import { ViewState, StudentPermissions } from '../types';
import { dataService } from '../services/dataService';

interface AccessLoginProps {
  setView: (view: ViewState) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setPermissions: (perms: StudentPermissions) => void;
}

export const AccessLogin: React.FC<AccessLoginProps> = ({ setView, setIsAdmin, setPermissions }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const perms = dataService.verifyStudentCode(code);
    
    if (perms) {
      setIsAdmin(false);
      setPermissions(perms); // Save permissions to state
      setView(ViewState.STUDENT_DASHBOARD);
    } else {
      setError('Invalid Access Code. Please check your WhatsApp/Email.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo
    if (username === 'admin' && password === 'RadheRadhe@01') {
      setIsAdmin(true);
      setView(ViewState.ADMIN_DASHBOARD);
    } else {
      setError('Invalid Admin Credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ayur-cream px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-ayur-green">
        <h2 className="text-2xl font-bold text-center text-ayur-brown mb-6">
          {activeTab === 'student' ? 'Student Access' : 'Admin Login'}
        </h2>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 font-semibold ${activeTab === 'student' ? 'text-ayur-green border-b-2 border-ayur-green' : 'text-gray-400'}`}
            onClick={() => { setActiveTab('student'); setError(''); }}
          >
            I have a Code
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${activeTab === 'admin' ? 'text-ayur-green border-b-2 border-ayur-green' : 'text-gray-400'}`}
            onClick={() => { setActiveTab('admin'); setError(''); }}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {activeTab === 'student' ? (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Access Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter unique code (e.g. AYUR-FP-1234)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-green outline-none font-mono uppercase"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-ayur-green hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors shadow-md"
            >
              Access Dashboard
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Don't have a code? <a href="#" className="text-ayur-saffron hover:underline">Enroll now</a> to receive one on WhatsApp.
            </p>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-green outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-green outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-ayur-brown hover:bg-orange-900 text-white py-3 rounded-lg font-bold transition-colors shadow-md"
            >
              Login to Admin Panel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
