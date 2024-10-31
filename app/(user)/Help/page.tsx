"use client";
import { ChangeEvent, useState } from "react";
import Questions from "./help-questions/page";

// Define interfaces for form data
interface HelpMeItem {
  id: number;
  selectedOption: string;
  text: string;
}

interface FormData {
  name: string;
  companyName: string;
  email: string;
  assistance: string;
  suggestions: string[];
  helpMe: HelpMeItem[];
  generalInfo: string[];
}

// Define interface for form errors
interface FormErrors {
  name?: string;
  companyName?: string;
  email?: string;
  assistance?: string;
  [key: string]: string | undefined; // Allow for additional error fields
}

const Page = () => {
  const initialFormData: FormData = {
    name: "",
    companyName: "",
    email: "",
    assistance: "",
    suggestions: [],
    helpMe: [],
    generalInfo: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [items, setItems] = useState<HelpMeItem[]>([
    { id: 1, selectedOption: "", text: "" },
  ]);

  const validate = () => {
    const tempErrors = {
      name: formData.name ? "" : "Name is required",
      companyName: formData.companyName ? "" : "Company Name is required",
      email: /\S+@\S+\.\S+/.test(formData.email) ? "" : "Email is not valid",
      assistance: formData.assistance ? "" : "Please select an option",
    };

    setErrors(tempErrors);
    return Object.values(tempErrors).every(error => !error);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as { name: keyof FormData; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      // Ensure helpMe is updated with the latest items
      const updatedFormData = { ...formData, helpMe: items };
      setFormData(updatedFormData);

      // Using a callback to log the form data after the state is updated
      setTimeout(() => {
        console.log("Form submitted:", updatedFormData);
      }, 0);
    }

    if (validate()) {
      alert("Form submitted");
    }
  };

  const handleOptionChange = (
    id: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, selectedOption: e.target.value } : item
    );
    setItems(newItems);
  };

  const handleTextChange = (
    id: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, text: e.target.value } : item
    );
    setItems(newItems);
  };

  const addItem = () => {
    const newItem = { id: items.length + 1, selectedOption: "", text: "" };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
  };

  const handleTextareaChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newSuggestions = [...formData.suggestions];
    newSuggestions[index] = e.target.value;
    setFormData(prev => ({ ...prev, suggestions: newSuggestions }));
  };

  const handleAddTextarea = () => {
    setFormData(prev => ({
      ...prev,
      suggestions: [...prev.suggestions, ""],
    }));
  };

  const handleRemoveTextarea = (index: number) => {
    const newSuggestions = formData.suggestions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, suggestions: newSuggestions }));
  };

  const handleGeneralInfoTextAreaChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newGeneralInfo = [...formData.generalInfo];
    newGeneralInfo[index] = e.target.value;
    setFormData(prev => ({ ...prev, generalInfo: newGeneralInfo }));
  };

  const handleAddGeneralInfoTextArea = () => {
    setFormData(prev => ({
      ...prev,
      generalInfo: [...prev.generalInfo, ""],
    }));
  };

  const handleRemoveGeneralInfoTextArea = (index: number) => {
    const newGeneralInfo = formData.generalInfo.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, generalInfo: newGeneralInfo }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedOption(value);
    setFormData(prev => ({ ...prev, assistance: value }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-red-600 mb-6 mt-5">
        SEND US A MESSAGE
      </h1>
      <div className="max-w-[840px] mx-auto mt-3 mb-10 p-5 bg-gray-100 rounded ">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-4 flex-col md:flex-row flex items-center justify-center">
            <label className="block  text-gray-500 w-full text-sm mt-4 md:mt-0">
              Name *
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 flex hover:bg-gray-300 hover:shadow-md transition duration-400 lg:w-[350px] w-full bg-gray-200 ${errors.name ? "border-l-2 border-l-red-500" : "border-gray-300"} py-2 px-3 shadow-sm focus:outline-none `}
              />
              {errors.name && (
                <p className="text-red-500 max-w-[350px] text-xs mt-2 bg-red-100 p-1">
                  {errors.name}
                </p>
              )}
            </label>
            <label className="block text-gray-500 w-full text-sm md:w-1/2 md:pl-2 mt-4 md:mt-0">
              Company Name *
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`mt-1 flex lg:w-[350px] w-full hover:shadow-md transition duration-400 hover:bg-gray-300  bg-gray-200 ${errors.companyName ? "border-l-2 border-l-red-500" : "border-gray-300"}  py-2 px-3 shadow-sm focus:outline-none `}
              />
              {errors.companyName && (
                <p className="text-red-500  text-xs mt-2 bg-red-100 p-1">
                  {errors.companyName}
                </p>
              )}
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-500 text-sm">
              Email Address *
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full hover:shadow-md transition duration-400 hover:bg-gray-300 bg-gray-200 ${errors.email ? "border-l-2 border-l-red-500" : "border-gray-300"}  py-2 px-3 shadow-sm focus:outline-none `}
              />
              {errors.email && (
                <p className="text-red-500  text-xs mt-2 bg-red-100 p-1">
                  {errors.email}
                </p>
              )}
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-500">
              How can we assist you?
              <select
                name="assistance"
                value={formData.assistance}
                onChange={handleSelectChange}
                className={`mt-1 block w-full hover:shadow-md hover:cursor-pointer transition duration-400  hover:bg-gray-300 bg-gray-200 h-10 ${errors.assistance ? "border-l-2 border-l-red-500" : "border-gray-300"}  py-2 px-3 shadow-sm focus:outline-none `}
              >
                <option value="Suggestions">Suggestions</option>
                <option value="HelpMe">Please help me with</option>
                <option value="General Info">General Info</option>
              </select>
              {errors.assistance && (
                <p className="text-red-500 text-xs mt-2 bg-red-100 p-1">
                  {errors.assistance}
                </p>
              )}
            </label>

            {selectedOption === "Suggestions" && (
              <>
                <h5 className="mt-5 text-xs text-gray-500 font-bold">
                  Suggestions
                </h5>
                <div className="border-l-4 p-4 rounded-md">
                  <div className="ml-4 text-sm">
                    <label>{`${selectedOption}`}:*</label>
                    <div className="block">
                      {formData.suggestions.map((suggestion, index) => (
                        <div key={index} className="mb-4 relative">
                          <textarea
                            name={`suggestions-${index}`}
                            value={suggestion}
                            onChange={e => handleTextareaChange(index, e)}
                            placeholder="e.g. feature request, improvement, other"
                            className="w-full p-4 h-32 bg-gray-200"
                          ></textarea>
                          <button
                            type="button"
                            onClick={() => handleRemoveTextarea(index)}
                            className="top-1 right-1 z-9 hover:text-red-600 border-2 text-gray-500 hover:bg-gray-100 pt-1 pb-1 pl-2 pr-2 rounded-full"
                          >
                            Remove item
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddTextarea}
                        className="mt-4 mb-4 border-2 text-gray-500 hover:bg-gray-100 pt-1 pb-1 pl-2 pr-2 rounded-full"
                      >
                        Add item
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedOption === "HelpMe" && (
              <div className="mt-5">
                {items.map(item => (
                  <div key={item.id}>
                    <label className="text-sm text-gray-500">
                      Please help me with...
                    </label>
                    <div className="mb-4 p-4 border-l-4 rounded">
                      <div className="mb-2">
                        <label className="block text-gray-500 text-sm mb-1">
                          I need assistance with...
                        </label>
                        <select
                          className={`mt-1 block w-full hover:shadow-md hover:cursor-pointer transition duration-400 hover:bg-gray-300 bg-gray-200 h-10 ${errors.assistance ? "border-l-2 border-l-red-500" : "border-gray-300"}  py-2 px-3 shadow-sm focus:outline-none `}
                          value={item.selectedOption}
                          onChange={e => handleOptionChange(item.id, e)}
                        >
                          <option value="">Select an option</option>
                          <option value="Updating my information">
                            Updating my information
                          </option>
                          <option value="Placing an order">
                            Placing an order
                          </option>
                          <option value="Payment">Payment</option>
                          <option value="Return">Return</option>
                          <option value="I can't login account">
                            I can’t login account
                          </option>
                        </select>
                      </div>
                      {item.selectedOption && (
                        <div>
                          <label className="block text-gray-700 mb-1">
                            {item.selectedOption}
                          </label>
                          <textarea
                            className="w-full p-4 h-32 bg-gray-200 hover:bg-gray-300 transition duration-400"
                            value={item.text}
                            onChange={e => handleTextChange(item.id, e)}
                            placeholder="Type here..."
                          ></textarea>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="top-1 right-1 z-9 hover:text-red-600 border-2 text-gray-500 hover:bg-gray-100 pt-1 pb-1 pl-2 pr-2 rounded-full"
                    >
                      Remove item
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-4 mb-4 border-2 text-gray-500 hover:bg-gray-100 pt-1 pb-1 pl-2 pr-2 rounded-full"
                  onClick={addItem}
                >
                  Add item
                </button>
              </div>
            )}

            {selectedOption === "General Info" && (
              <>
                <h5 className="mt-5 text-xs text-gray-500 font-bold">
                  General Info
                </h5>
                <div className="border-l-4 p-4 rounded-md">
                  <div className="ml-4 text-sm">
                    <label>{`${selectedOption}`}:*</label>
                    <div className="block">
                      {formData.generalInfo.map((generalInfo, index) => (
                        <div key={index} className="mb-4 relative">
                          <textarea
                            name={`generalInfo-${index}`}
                            value={generalInfo}
                            onChange={e =>
                              handleGeneralInfoTextAreaChange(index, e)
                            }
                            placeholder="e.g. feature request, improvement, other"
                            className="w-full p-4 h-32 bg-gray-200"
                          ></textarea>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveGeneralInfoTextArea(index)
                            }
                            className="top-1 right-1 z-9 hover:text-red-600 border-2 text-gray-500 hover:bg-gray-100 pt-1 pb-1 pl-2 pr-2 rounded-full"
                          >
                            Remove Item
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddGeneralInfoTextArea}
                        className="mt-4 mb-4 border-2 text-gray-500 hover:bg-gray-100 pt-1 pb-1 pl-2 pr-2 rounded-full"
                      >
                        Add item
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="lg:w-auto md:w-full w-full mb-10 bg-blue-500 text-white py-2 p-1 shadow-md hover:bg-blue-700 hover:shadow-xl transition duration-400"
          >
            Send Message
          </button>
        </form>
      </div>
      {/* Horizontal line */}
      <div className="w-full h-px   bg-gray-500 my-8"></div>

      <Questions />
    </div>
  );
};

export default Page;

//submit form
// if (validate()) {
//   setFormData((prev) => ({ ...prev, helpMe: items }));
//   console.log("Form submitted:", formData);
// }
