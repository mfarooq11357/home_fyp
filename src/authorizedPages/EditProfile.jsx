import { Save, X, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react"

const ProfileEditPage = () => {
  return (
    <div className="container mx-auto pt-12 py-6 px-4 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 relative bg-white p-6">
        {/* Profile Section - 3/5 width on large screens */}
        <div className="w-full lg:w-3/5 lg:pr-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Edit Profile</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md group">
              <img
                src="https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"
                alt="Profile picture"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Subhan Ali</h2>
              <p className="text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Subhanali@uog.edu.pk
              </p>
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="firstName" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                defaultValue="Subhan Ali"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="lastName" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                defaultValue="Ali Raza"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="gender" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Gender
              </label>
              <input
                id="gender"
                type="text"
                defaultValue="21012298-001@uog.edu.pk"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="country" className="text-gray-500 text-sm flex items-center">
                <Flag className="w-4 h-4 mr-1" />
                Country
              </label>
              <input
                id="country"
                type="text"
                defaultValue="21012298-001"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="jobStatus" className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Job Status
              </label>
              <input
                id="jobStatus"
                type="text"
                defaultValue="Male"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="rollNo" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Roll No
              </label>
              <input
                id="rollNo"
                type="text"
                defaultValue="Pakistan"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="role" className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Role
              </label>
              <input
                id="role"
                type="text"
                defaultValue="Role"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="email" className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue="Job status"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="address" className="text-gray-500 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </label>
              <input
                id="address"
                type="text"
                defaultValue="ABC street, Gujrat, Pakistan"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="tel" className="text-gray-500 text-sm flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Tel #
              </label>
              <input
                id="tel"
                type="tel"
                defaultValue="+92 310 1234567"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
              />
            </div>

            {/* Form Buttons */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Divider - Using the provided image URL */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        {/* Upcoming Events Section - 2/5 width on large screens */}
        <div className="w-full lg:w-2/5 mt-8 lg:mt-0">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 flex items-center">
            <Calendar className="mr-2 text-blue-600" />
            Upcoming Events
          </h1>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">Tech fest</h2>
                <p className="text-blue-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Tuesday, 20 March 2025
                </p>
              </div>
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src="https://i.ibb.co/1YSzM2hL/image-7.png"
                  alt="Tech fest event"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Tech Event
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">Kheil Tamasha</h2>
                <p className="text-blue-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Tuesday, 20 March 2025
                </p>
              </div>
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src="https://i.ibb.co/Zs0rtgG/image-7-1.png"
                  alt="Kheil Tamasha event"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Games
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditPage
