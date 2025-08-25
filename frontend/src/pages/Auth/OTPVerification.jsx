import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  const { user, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.isVerified) {
      navigate('/dashboard');
      return;
    }

    // Send OTP on component mount
    handleSendOTP();
  }, [user, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSendOTP = async () => {
    setIsResending(true);
    try {
      await sendOTP();
      toast.success('OTP sent to your email!');
      setTimer(300);
      setCanResend(false);
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(otpString);
      toast.success('Account verified successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid or expired OTP');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="p-4 bg-government-100 rounded-full">
              <Mail className="h-12 w-12 text-government-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Verify Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-government-600">{user.email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-government-500 focus:ring-government-500 focus:outline-none"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-gray-600">
                Resend OTP in <span className="font-medium text-government-600">{formatTime(timer)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isResending}
                className="text-sm font-medium text-government-600 hover:text-government-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend OTP'
                )}
              </button>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-government-600 hover:bg-government-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-government-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="loading-spinner h-5 w-5"></div>
              ) : (
                'Verify Account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secure verification process</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            This helps us ensure the security of your account and documents
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;