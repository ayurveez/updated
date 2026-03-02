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
  const [loginMethod, setLoginMethod] = useState<'code' | 'otp'>('code');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [userName, setUserName] = useState('');

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (loginMethod === 'code') {
        // Verify registration code from sheet
        const response = await dataService.verifyRegistrationCode(code);
        
        if (response.success) {
          // Code is valid, get user permissions
          const perms = await dataService.verifyStudentCode(code);
          if (perms) {
            setIsAdmin(false);
            setPermissions(perms);
            setView(ViewState.STUDENT_DASHBOARD);
          } else {
            setError('Invalid Access Code. Please check your Email.');
          }
        } else {
          setError(response.error || 'Invalid registration code');
        }
      } else {
        // OTP login flow
        if (!otpVerified) {
          setError('Please verify OTP first');
          return;
        }
        
        // Verify OTP and get code
        const verifyResponse = await dataService.verifyOTP(email, otp);
        if (verifyResponse.success && verifyResponse.code) {
          const perms = await dataService.verifyStudentCode(verifyResponse.code);
          if (perms) {
            setIsAdmin(false);
            setPermissions(perms);
            setView(ViewState.STUDENT_DASHBOARD);
          } else {
            setError('Error accessing dashboard');
          }
        } else {
          setError(verifyResponse.error || 'OTP verification failed');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if user exists in sheet
      const checkResponse = await dataService.checkUserExists(email);
      
      if (!checkResponse.success) {
        setError(checkResponse.error || 'Error checking user');
        return;
      }

      if (!checkResponse.exists) {
        // Redirect to registration form
        window.open('https://forms.gle/mynXAkXzi5pVPFUNA', '_blank');
        setSuccess('Please complete the registration form and try again');
        return;
      }

      // Send OTP
      const otpResponse = await dataService.sendOTP(email);
      
      if (otpResponse.success) {
        setOtpSent(true);
        setUserName(checkResponse.name || '');
        setSuccess(`OTP sent to ${email}`);
      } else {
        setError(otpResponse.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await dataService.verifyOTP(email, otp);
      
      if (response.success) {
        setOtpVerified(true);
        setSuccess('OTP verified successfully! You can now login.');
      } else {
        setError(response.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
            onClick={() => { setActiveTab('student'); setError(''); setSuccess(''); }}
          >
            Student Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${activeTab === 'admin' ? 'text-ayur-green border-b-2 border-ayur-green' : 'text-gray-400'}`}
            onClick={() => { setActiveTab('admin'); setError(''); setSuccess(''); }}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded border border-green-200">
            {success}
          </div>
        )}

        {activeTab === 'student' ? (
          <div className="space-y-4">
            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  loginMethod === 'code' ? 'bg-white shadow text-ayur-green' : 'text-gray-600'
                }`}
                onClick={() => {
                  setLoginMethod('code');
                  setError('');
                  setSuccess('');
                  setOtpSent(false);
                  setOtpVerified(false);
                }}
              >
                Registration Code
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  loginMethod === 'otp' ? 'bg-white shadow text-ayur-green' : 'text-gray-600'
                }`}
                onClick={() => {
                  setLoginMethod('otp');
                  setError('');
                  setSuccess('');
                }}
              >
                Email OTP
              </button>
            </div>

            <form onSubmit={handleStudentLogin} className="space-y-4">
              {loginMethod === 'code' ? (
                // Registration Code Login
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter your registration code"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-green outline-none font-mono uppercase"
                    required
                    disabled={loading}
                  />
                </div>
              ) : (
                // OTP Login
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-green outline-none"
                        required
                        disabled={loading || otpSent}
                      />
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={loading || !email}
                          className="px-4 bg-ayur-green hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpVerified(false);
                            setOtp('');
                          }}
                          className="px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && !otpVerified && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit OTP"
                          maxLength={6}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-green outline-none font-mono"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOTP}
                          disabled={loading || otp.length !== 6}
                          className="px-4 bg-ayur-saffron hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {loading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="mt-2 text-sm text-ayur-green hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading || 
                  (loginMethod === 'code' ? !code : !otpVerified)
                }
                className="w-full bg-ayur-green hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </span>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>

            <p className="text-xs text-center text-gray-500 mt-4">
              Not registered?{' '}
              <a 
                href="https://forms.gle/mynXAkXzi5pVPFUNA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-ayur-saffron hover:underline font-semibold"
              >
                Register here
              </a>
            </p>
          </div>
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
