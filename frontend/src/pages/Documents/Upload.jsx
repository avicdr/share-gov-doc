import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  FileText, 
  Calendar,
  Building,
  X,
  CheckCircle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: '',
    metadata: {
      documentNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: ''
    }
  });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const documentTypes = [
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          [metadataField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    
    // Auto-fill title if not already filled
    if (!formData.title) {
      const fileName = selectedFile.name.split('.')[0];
      setFormData({
        ...formData,
        title: fileName
      });
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.documentType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('document', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('documentType', formData.documentType);
      uploadData.append('metadata', JSON.stringify(formData.metadata));

      await api.post('/documents', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Document uploaded successfully!');
      navigate('/documents');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload document';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h1>
        <p className="text-gray-600">
          Upload your government documents securely to the system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Upload Area */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Document</h2>
          
          <div
            className={`drag-zone ${dragActive ? 'drag-over' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileInputChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />
            
            {!file ? (
              <label htmlFor="file-upload" className="cursor-pointer">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your file here, or <span className="text-government-600">browse</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: JPEG, PNG, PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">{file.name}</p>
                    <p className="text-sm text-green-700">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 text-green-600 hover:text-green-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Document Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Document Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter document title"
              />
            </div>

            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                id="documentType"
                name="documentType"
                required
                value={formData.documentType}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select document type</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter document description (optional)"
              />
            </div>
          </div>
        </div>

        {/* Document Metadata */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="metadata.documentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Document Number
              </label>
              <input
                type="text"
                id="metadata.documentNumber"
                name="metadata.documentNumber"
                value={formData.metadata.documentNumber}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter document number"
              />
            </div>

            <div>
              <label htmlFor="metadata.issuingAuthority" className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Authority
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="metadata.issuingAuthority"
                  name="metadata.issuingAuthority"
                  value={formData.metadata.issuingAuthority}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter issuing authority"
                />
                <Building className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label htmlFor="metadata.issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="metadata.issueDate"
                  name="metadata.issueDate"
                  value={formData.metadata.issueDate}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                />
                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label htmlFor="metadata.expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="metadata.expiryDate"
                  name="metadata.expiryDate"
                  value={formData.metadata.expiryDate}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                />
                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !file}
            className="px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-government-600 hover:bg-government-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-government-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="loading-spinner h-4 w-4 mr-2"></div>
                Uploading...
              </div>
            ) : (
              <>
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;