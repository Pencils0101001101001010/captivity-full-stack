import React, { useState } from "react";

const Modal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Handle form submission, e.g., send data to an API
    // Reset the form
    setFormData({
      name: "",
      lastname: "",
      company: "",
      email: "",
      message: "",
    });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white h-full rounded-lg shadow-lg p-6 w-full overflow-auto max-w-[700px] relative">
        <button
          className="text-gray-500 absolute top-4 right-4 hover:text-red-500"
          onClick={onClose}
        >
          X
        </button>
        <form onSubmit={handleSubmit} className="space-y-5 w-full  mx-auto">
          <h1 className="text-3xl font-bold mb-15 text-red-500 ">
            SEND US A MESSAGE
          </h1>

          <div className="p-2">
            <label className="block text-start text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-4 bg-gray-100 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="p-2">
            <label className="block text-start text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 p-4 bg-gray-100 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="p-2">
            <label className="block text-start text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-4 bg-gray-100 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="p-2">
            <label className="block text-start text-sm font-medium text-gray-700">
              Company name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="mt-1 p-4 bg-gray-100 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="p-2">
            <label className="block text-start text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 p-4 bg-gray-100 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows="4"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
