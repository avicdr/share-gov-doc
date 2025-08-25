import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  FileText, 
  Download,
  Calendar,
  User,
  Eye
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const SharedDocuments = () => {
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedDocuments();
  }, []);

  const fetchSharedDocuments = async () => {
    try {
      const response = await api.get('/documents/shared');
      setSharedDocuments(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch shared documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'pan_card': 'PAN Card',
      'aadhaar_card': 'Aadhaar Card',
      'passport': 'Passport',
      'driving_license': 'Driving License',
      'voter_id': 'Voter ID',
      'mark_sheet': 'Mark Sheet',
      'degree_certificate': 'Degree Certificate',
      'income_certificate': 'Income Certificate',
      'caste_certificate': 'Caste Certificate',
      'birth_certificate': 'Birth Certificate',
      'other': 'Other'
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUserPermissions = (document, userId) => {
    const shareInfo = document.sharedWith.find(share => share.user._id === userId);
    return shareInfo ? shareInfo.permissions : [];
  };

  if (loading) {
    return <LoadingSpinner text="Loading shared documents..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared Documents</h1>
        <p className="text-gray-600">
          Documents that have been shared with you by family members
        </p>
      </div>

      {/* Documents List */}
      {sharedDocuments.length > 0 ? (
        <div className="space-y-6">
          {sharedDocuments.map((document) => {
            const shareInfo = document.sharedWith.find(share => share.user);
            const canDownload = shareInfo?.permissions.includes('download');
            
            return (
              <div key={document._id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-government-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-government-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {document.title}
                        </h3>
                        <span className="status-badge bg-blue-100 text-blue-800">
                          {getDocumentTypeLabel(document.documentType)}
                        </span>
                      </div>
                      
                      {document.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {document.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>Shared by {document.owner.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(document.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{formatFileSize(document.fileSize)}</span>
                        </div>
                      </div>
                      
                      {shareInfo && (
                        <div className="mt-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Permissions:</span>
                            {shareInfo.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="status-badge bg-green-100 text-green-800 text-xs"
                              >
                                {permission === 'view' ? 'View' : 'Download'}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Shared on {new Date(shareInfo.sharedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      className="p-2 text-gray-400 hover:text-government-600 transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    
                    {canDownload && (
                      <button
                        onClick={() => handleDownload(document._id, document.fileName)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Share2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No shared documents
          </h3>
          <p className="text-gray-500 mb-6">
            No documents have been shared with you yet. Ask your family members to share their documents with you using your Aadhaar number.
          </p>
          <div className="bg-government-50 border border-government-200 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-medium text-government-800 mb-2">
              How to receive shared documents:
            </h4>
            <ol className="text-sm text-government-700 text-left space-y-1">
              <li>1. Share your Aadhaar number with family members</li>
              <li>2. They can share documents with you from their account</li>
              <li>3. Shared documents will appear here automatically</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedDocuments;