import { FileText, CheckCircle, Award, Shield, BookOpen } from "lucide-react"

const RequestCertificatePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
          <FileText className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Character Certificate Request</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Need a character certificate? We've got you covered. Request your certificate online and pick it up from the
          admin office.
        </p>
      </div>

      {/* <div className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Official Verification</h3>
            <p className="text-gray-600">
              Our certificates are officially recognized and provide verification of your character and conduct.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Academic Excellence</h3>
            <p className="text-gray-600">
              Showcase your academic achievements and behavioral excellence with our official certificates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Future Opportunities</h3>
            <p className="text-gray-600">
              Use your character certificate for job applications, further education, or visa applications.
            </p>
          </div>
        </div>
      </div> */}

      {/* Process Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-16">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Get Your Certificate</h2>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Your Certificate</h3>
                <p className="mt-1 text-gray-600">
                  Click on the "Request Certificate" button below to submit your request. Make sure your profile
                  information is up to date.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Wait for Processing</h3>
                <p className="mt-1 text-gray-600">
                  Your request will be processed within 24 hours. You will receive a notification when it's ready.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                3
              </div>
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

      {/* Request Button Section */}
      <div className="max-w-md mx-auto text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition-all font-medium text-lg shadow-md hover:shadow-lg flex items-center justify-center mx-auto">
          <FileText className="h-5 w-5 mr-2" />
          Request Certificate
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Note: You can only request one certificate at a time. Please allow 24 hours for processing.
        </p>
      </div>

      {/* Status Section (Optional) */}
      <div className="max-w-md mx-auto mt-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
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
      </div>
    </div>
  )
}

export default RequestCertificatePage
