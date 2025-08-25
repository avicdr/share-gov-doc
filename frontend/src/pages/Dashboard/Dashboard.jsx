import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Upload, 
  Share2, 
  Shield,
  TrendingUp,
  Users,
  Clock,
  Eye
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    sharedDocuments: 0,
    recentUploads: 0
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [documentsRes, sharedRes] = await Promise.all([
        api.get('/documents?limit=5'),
        api.get('/documents/shared')
      ]);

      setRecentDocuments(documentsRes.data.data);
      setStats({
        totalDocuments: documentsRes.data.total || 0,
        sharedDocuments: sharedRes.data.count || 0,
        recentUploads: documentsRes.data.data.filter(doc => 
          new Date(doc.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Upload Document',
      description: 'Add a new government document',
      href: '/documents/upload',
      icon: Upload,
      color: 'bg-green-500'
    },
    {
      name: 'View Documents',
      description: 'Browse your uploaded documents',
      href: '/documents',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Shared Documents',
      description: 'View documents shared with you',
      href: '/documents/shared',
      icon: Share2,
      color: 'bg-purple-500'
    },
    {
      name: 'Profile Settings',
      description: 'Manage your account settings',
      href: '/profile',
      icon: Shield,
      color: 'bg-gray-500'
    }
  ];

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

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your government documents securely and efficiently.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-government-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Documents
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalDocuments}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Share2 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Shared Documents
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.sharedDocuments}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Recent Uploads
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.recentUploads}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="card hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-government-600">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
          <Link
            to="/documents"
            className="text-sm font-medium text-government-600 hover:text-government-500"
          >
            View all documents →
          </Link>
        </div>
        
        {recentDocuments.length > 0 ? (
          <div className="card">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentDocuments.map((document, index) => (
                  <li key={document._id}>
                    <div className="relative pb-8">
                      {index !== recentDocuments.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-government-500 flex items-center justify-center ring-8 ring-white">
                            <FileText className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Uploaded{' '}
                              <span className="font-medium text-gray-900">
                                {document.title}
                              </span>
                            </p>
                            <p className="text-xs text-gray-400">
                              Type: {getDocumentTypeLabel(document.documentType)}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={document.createdAt}>
                              {new Date(document.createdAt).toLocaleDateString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your first document.
            </p>
            <div className="mt-6">
              <Link
                to="/documents/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-government-600 hover:bg-government-700"
              >
                <Upload className="-ml-1 mr-2 h-4 w-4" />
                Upload Document
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Security Status */}
      <div className="card bg-government-50 border-government-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-government-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-government-800">
              Account Security Status
            </h3>
            <div className="mt-2 text-sm text-government-700">
              <p>
                ✓ Account verified with OTP<br />
                ✓ Secure document storage<br />
                ✓ Encrypted data transmission
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;