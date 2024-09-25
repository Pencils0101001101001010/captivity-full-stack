"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./contact.module.css";

const Contact = () => {
  const [mounted, setMounted] = useState(false);
  const formRef = useRef(null); // Create a ref for the form section

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialFormData = {
    name: "",
    companyName: "",
    email: "",
    assistance: "",
    suggestions: [],
    helpMe: [],
    generalInfo: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [items, setItems] = useState([{ id: 1, selectedOption: "", text: "" }]);

  const validate = () => {
    const tempErrors = {
      name: formData.name ? "" : "Name is required",
      companyName: formData.companyName ? "" : "Company Name is required",
      email: /\S+@\S+\.\S+/.test(formData.email) ? "" : "Email is not valid",
      assistance: formData.assistance ? "" : "Please select an option",
    };

    setErrors(tempErrors);
    return Object.values(tempErrors).every((error) => !error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const updatedFormData = { ...formData, helpMe: items };
      setFormData(updatedFormData);

      // Using a callback to log the form data after the state is updated
      setTimeout(() => {
        console.log("Form submitted:", updatedFormData);
      }, 0);

      alert("Form submitted");
    }
  };

  const handleOptionChange = (id, e) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, selectedOption: e.target.value } : item
    );
    setItems(newItems);
  };

  const handleTextChange = (id, e) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, text: e.target.value } : item
    );
    setItems(newItems);
  };

  const addItem = () => {
    const newItem = { id: items.length + 1, selectedOption: "", text: "" };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  const handleTextareaChange = (index, e) => {
    const newSuggestions = [...formData.suggestions];
    newSuggestions[index] = e.target.value;
    setFormData((prev) => ({ ...prev, suggestions: newSuggestions }));
  };

  const handleAddTextarea = () => {
    setFormData((prev) => ({
      ...prev,
      suggestions: [...prev.suggestions, ""],
    }));
  };

  const handleRemoveTextarea = (index) => {
    const newSuggestions = formData.suggestions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, suggestions: newSuggestions }));
  };

  const handleGeneralInfoTextAreaChange = (index, e) => {
    const newGeneralInfo = [...formData.generalInfo];
    newGeneralInfo[index] = e.target.value;
    setFormData((prev) => ({ ...prev, generalInfo: newGeneralInfo }));
  };

  const handleAddGeneralInfoTextArea = () => {
    setFormData((prev) => ({
      ...prev,
      generalInfo: [...prev.generalInfo, ""],
    }));
  };

  const handleRemoveGeneralInfoTextArea = (index) => {
    const newGeneralInfo = formData.generalInfo.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, generalInfo: newGeneralInfo }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setSelectedOption(value);
    setFormData((prev) => ({ ...prev, assistance: value }));
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <section>
      <div>
        <div>
          <h1 className="text-2xl font-bold text-center text-red-600 mb-6 mt-5">
            CONTACT US
          </h1>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
              onClick={() => {
                document
                  .getElementById("send-us-message")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Send us a message
            </button>
          </div>
        </div>
        {/* Contact Details */}
        <div className="max-w mx-auto mt-10 mb-5 p-5 bg-gray-100 rounded">
          <div className="mb-4 mt-4 flex-col md:flex-row flex items-center justify-center">
            CAPE TOWN
          </div>
        </div>
        <div>
          <div className="max-w mx-auto mt-10 mb-5 p-5 bg-gray-100 rounded">
            <div className="mb-4 mt-4 flex-col md:flex-row flex items-center justify-center">
              JOHANNESBURG
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-center text-red-600 mb-6 mt-5">
              DISTRIBUTORS
            </h1>
          </div>
        </div>
        <div className="max-w mx-auto mt-10 mb-5 p-5 bg-gray-100 rounded">
          <div className="mb-4 mt-4 flex-col md:flex-row flex items-center justify-center">
            PORT ELIZABETH
          </div>
        </div>
        <div className="max-w mx-auto mt-10 mb-5 p-5 bg-gray-100 rounded">
          <div className="mb-4 mt-4 flex-col md:flex-row flex items-center justify-center">
            EAST LONDON
          </div>
        </div>
        <div className="max-w mx-auto mt-10 mb-5 p-5 bg-gray-100 rounded">
          <div className="mb-4 mt-4 flex-col md:flex-row flex items-center justify-center">
            SWAZILAND
          </div>
        </div>
        <div className="max-w mx-auto mt-10 mb-5 p-5 bg-gray-100 rounded">
          <div className="mb-4 mt-4 flex-col md:flex-row flex items-center justify-center">
            ZIMBABWE
          </div>
        </div>
      </div>

      <div>
        <h1
          id="send-us-message"
          className="text-2xl font-bold text-center text-red-600 mb-5 mt-10"
        >
          SEND US A MESSAGE
        </h1>
      </div>

      <div className="relative">
        <div
          className="max-w-[840px] mx-auto mt-3 mb-10 p-5 bg-gray-100 rounded"
          ref={formRef} // Attach ref to the form section
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col md:flex-row items-start justify-between">
              <div className="w-full md:w-1/2 md:pl-2 mt-4">
                <label className="block text-gray-500">First Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full hover:bg-gray-300 hover:shadow-md transition duration-400 bg-gray-200 ${
                    errors.name
                      ? "border-l-2 border-l-red-500"
                      : "border-gray-300"
                  } py-2 px-3 shadow-sm focus:outline-none`}
                />
                {errors.name && (
                  <p className="text-red-500 max-w-[350px] text-xs mt-2 bg-red-100 p-1">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="w-full md:w-1/2 md:pl-2 mt-4">
                <label className="block text-gray-500">Surname</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className={`mt-1 block w-full hover:bg-gray-300 hover:shadow-md transition duration-400 bg-gray-200 ${
                    errors.surname
                      ? "border-l-2 border-l-red-500"
                      : "border-gray-300"
                  } py-2 px-3 shadow-sm focus:outline-none`}
                />
                {errors.surname && (
                  <p className="text-red-500 text-xs mt-2 bg-red-100 p-1">
                    {errors.surname}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4 flex flex-col md:flex-row items-start justify-between">
              <div className="w-full md:w-1/2 md:pl-2 mt-4">
                <label className="block text-gray-500 text-sm">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full hover:bg-gray-300 hover:shadow-md transition duration-400 bg-gray-200 ${
                    errors.email
                      ? "border-l-2 border-l-red-500"
                      : "border-gray-300"
                  } py-2 px-3 shadow-sm focus:outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 bg-red-100 p-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="w-full md:w-1/2 md:pl-2 mt-4">
                <label className="block text-gray-500 text-sm">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full hover:bg-gray-300 hover:shadow-md transition duration-400 bg-gray-200 ${
                    errors.phone
                      ? "border-l-2 border-l-red-500"
                      : "border-gray-300"
                  } py-2 px-3 shadow-sm focus:outline-none`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-2 bg-red-100 p-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500">Company *</label>
              <textarea
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`mt-1 block w-full resize-y hover:bg-gray-300 hover:shadow-md transition duration-400 bg-gray-200 ${
                  errors.company
                    ? "border-l-2 border-l-red-500"
                    : "border-gray-300"
                } py-2 px-3 shadow-sm focus:outline-none`}
                rows="4"
                placeholder="E.g. Captivity Promotions"
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-2 bg-red-100 p-1">
                  {errors.company}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`mt-1 block w-full resize-y hover:bg-gray-300 hover:shadow-md transition duration-400 bg-gray-200 ${
                  errors.message
                    ? "border-l-2 border-l-red-500"
                    : "border-gray-300"
                } py-2 px-3 shadow-sm focus:outline-none`}
                rows="4"
                placeholder="Enter your message..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-2 bg-red-100 p-1">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="mt-10 mb-5 flex">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 text-sm"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
        <div className={styles.scrollToTop}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to Top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <path d="M19 15l-7-7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
