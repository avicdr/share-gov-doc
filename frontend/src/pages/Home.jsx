import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  FileText, 
  Share2, 
  Lock, 
  CheckCircle, 
  Users,
  ArrowRight,
  Smartphone,
  Globe
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Your documents are encrypted and stored with bank-level security protocols.'
    },
    {
      icon: FileText,
      title: 'Easy Management',
      description: 'Upload, organize, and manage all your government documents in one place.'
    },
    {
      icon: Share2,
      title: 'Safe Sharing',
      description: 'Share documents with family members using Aadhaar-based authentication.'
    },
    {
      icon: Lock,
      title: 'OTP Verification',
      description: 'Two-factor authentication ensures only authorized access to your documents.'
    },
    {
      icon: Users,
      title: 'Family Access',
      description: 'Grant controlled access to trusted family members for important documents.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your documents anytime, anywhere from any device.'
    }
  ];

  const documentTypes = [
    'PAN Card', 'Aadhaar Card', 'Passport', 'Driving License',
    'Voter ID', 'Mark Sheets', 'Degree Certificates', 'Income Certificates',
    'Caste Certificates', 'Birth Certificates'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-government-600 to-government-800"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">Secure Government</span>
              <span className="block text-government-200">Document Portal</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-government-100 sm:max-w-3xl">
              Upload, manage, and securely share your government documents with family members. 
              Protected by advanced encryption and OTP verification.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-government-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-government-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-government-500 hover:bg-government-400 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-government-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for document management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
              Our platform provides comprehensive tools to manage your government documents securely and efficiently.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="fade-in">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-government-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supported Documents */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Supported Document Types
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Store and manage all your important government documents in one secure place
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {documentTypes.map((docType, index) => (
              <div key={index} className="col-span-1 flex justify-center py-8 px-8 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-government-500 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">{docType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-government-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Getting started is simple and secure
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-government-100 rounded-full">
                  <span className="text-2xl font-bold text-government-600">1</span>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Register with Aadhaar</h3>
                <p className="mt-4 text-base text-gray-600">
                  Create your account using your Aadhaar number for secure identification
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-government-100 rounded-full">
                  <span className="text-2xl font-bold text-government-600">2</span>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Verify with OTP</h3>
                <p className="mt-4 text-base text-gray-600">
                  Complete email verification with OTP for enhanced security
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-government-100 rounded-full">
                  <span className="text-2xl font-bold text-government-600">3</span>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Upload & Share</h3>
                <p className="mt-4 text-base text-gray-600">
                  Upload your documents and share securely with family members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-government-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Create your account today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-government-100">
              Join thousands of users who trust our platform with their important documents.
            </p>
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-government-600 bg-white hover:bg-government-50 sm:w-auto transition-colors duration-200"
            >
              Sign up for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;