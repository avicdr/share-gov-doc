import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-government-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-government-300" />
              <span className="font-bold text-xl">GovDoc Portal</span>
            </div>
            <p className="text-government-300 max-w-md">
              Secure government document management system. Upload, manage, and share 
              your important documents with family members safely and efficiently.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-government-300 tracking-wider uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">Document Upload</a></li>
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">Secure Sharing</a></li>
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">OTP Verification</a></li>
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">Audit Logs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-government-300 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-government-200 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-government-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-government-300 text-sm">
              © 2025 Government Document Portal. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-government-300 text-sm">
                🔒 Secured by Advanced Encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;