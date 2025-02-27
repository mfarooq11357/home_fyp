import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Signup() {
    return (
      <div className="min-h-[550px] bg-black  flex items-center justify-center p-4">
        <div className="bg-gray-100 backdrop-blur-sm rounded-lg p-8 w-full max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Registration Form</h1>
            <p className="text-gray-600 text-sm">Fill in the form carefully for registration</p>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className=" block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                    className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
  
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                      className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
  
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact No</label>
                <input
                  type="tel"
                  id="contact"
           className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
  
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <input
                  type="text"
                  id="gender"
                       className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
  
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  id="role"
                       className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
  
              <div>
                <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">Roll No</label>
                <input
                  type="text"
                  id="rollNo"
                      className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
  
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                       className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
                />
              </div>
            </div>
  
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-2 rounded-full bg-lime-500 text-white hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  
  