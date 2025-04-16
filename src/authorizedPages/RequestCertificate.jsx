import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FileText, CheckCircle } from "lucide-react";

const RequestCertificatePage = () => {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/certificateRequestRoutes/request-certificate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
          <FileText className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Character Certificate Request</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Need a character certificate? We've got you covered. Request your certificate online and pick it up from the admin office.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-16">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Get Your Certificate</h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">1</div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Your Certificate</h3>
                <p className="mt-1 text-gray-600">
                  Click on the "Request Certificate" button below to submit your request. Make sure your profile information is up to date.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">2</div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Wait for Processing</h3>
                <p className="mt-1 text-gray-600">
                  Your request will be processed within 24 hours. You will receive a notification when it's ready.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">3</div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Visit Admin Office</h3>
                <p className="mt-1 text-gray-600">
                  Visit the admin office with your student ID to collect your character certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center">
        <button
          onClick={handleRequest}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition-all font-medium text-lg shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
        >
          <FileText className="h-5 w-5 mr-2" />
          {loading ? 'Requesting...' : 'Request Certificate'}
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Note: You can only request one certificate at a time. Please allow 24 hours for processing.
        </p>
      </div>

      {/* <div className="max-w-md mx-auto mt-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">No Pending Requests</h3>
            <p className="mt-1 text-sm text-gray-600">
              You don't have any pending certificate requests. You can request a new certificate now.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RequestCertificatePage;