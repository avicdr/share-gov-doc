import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter,
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const documentTypes = [
    { value: '', label: 'All Documents' },
    { value: 'pan_card', label: 'PAN Card' },
    { value: 'aadhaar_card', label: 'Aadhaar Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'voter_id', label: 'Voter ID' },
    { value: 'mark_sheet', label: 'Mark Sheet' },
    { value: 'degree_certificate', label: 'Degree Certificate' },
    { value: 'income_certificate', label: 'Income Certificate' },
    { value: 'caste_certificate', label: 'Caste Certificate' },
    { value: 'birth_certificate', label: 'Birth Certificate' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, filterType, searchTerm]);

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filterType && { documentType: filterType }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await api.get(`/documents?${params}`);
      setDocuments(response.data.data);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`/documents/${documentId}`);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
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
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <LoadingSpinner text="Loading documents..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">Manage your government documents securely</p>
        </div>
        <Link
          to="/documents/upload"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-government-600 hover:bg-government-700 transition-colors duration-200"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field pl-10"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {documents.map((document) => (
              <div key={document._id} className="document-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-government-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {document.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getDocumentTypeLabel(document.documentType)}
                      </p>
                    </div>
                  </div>
                </div>

                {document.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {document.description}
                  </p>
                )}

                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(document.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {formatFileSize(document.fileSize)}
                  </div>
                </div>

                {document.sharedWith && document.sharedWith.length > 0 && (
                  <div className="flex items-center text-xs text-blue-600 mb-4">
                    <Share2 className="h-3 w-3 mr-1" />
                    Shared with {document.sharedWith.length} member(s)
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(document._id, document.fileName)}
                      className="p-2 text-gray-400 hover:text-government-600 transition-colors duration-200"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <Link
                      to={`/documents/${document._id}/share`}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/documents/${document._id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(document._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'text-white bg-government-600'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterType 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by uploading your first document'
            }
          </p>
          <Link
            to="/documents/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-government-600 hover:bg-government-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Link>
        </div>
      )}
    </div>
  );
};

export default Documents;