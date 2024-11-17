"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { useContactStore } from "../../welcome/_store/contactUsStore";

interface ContactFormData {
  id?: string | null; // Updated type to include null
  city: string;
  telephone: string;
  general: string;
  websiteQueries: string;
}

const ContactUs = () => {
  const { user } = useSession();
  const {
    contacts,
    isLoading,
    error,
    fetchContacts,
    updateContact,
    createContact,
    deleteContact,
  } = useContactStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    id: null, // Initialize with null
    city: "",
    telephone: "",
    general: "",
    websiteQueries: "",
  });

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (contact: ContactFormData) => {
    setFormData({
      ...contact,
      id: contact.id || null, // Ensure id is never undefined
    });
    setEditingId(contact.id || null); // Handle potential undefined
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      city: "",
      telephone: "",
      general: "",
      websiteQueries: "",
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      id: null,
      city: "",
      telephone: "",
      general: "",
      websiteQueries: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateContact(editingId, formData);
      } else {
        await createContact(formData);
      }
      handleCancel();
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this contact information?"
      )
    ) {
      await deleteContact(id);
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const renderForm = (data: ContactFormData, isNew: boolean = false) => (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-4 rounded-lg mt-4"
    >
      <div>
        <label className="block text-sm font-medium text-white">City</label>
        <input
          type="text"
          name="city"
          value={data.city}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          Telephone
        </label>
        <input
          type="text"
          name="telephone"
          value={data.telephone}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          General Email
        </label>
        <input
          type="email"
          name="general"
          value={data.general}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">
          Website Queries Email
        </label>
        <input
          type="email"
          name="websiteQueries"
          value={data.websiteQueries}
          onChange={handleInputChange}
          className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Save size={16} />
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  );

  const renderContact = (contact: ContactFormData) => {
    // Ensure we have an id before rendering edit/delete buttons
    if (!contact.id) return null;

    return (
      <div key={contact.id} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">{contact.city}</h3>
          {user?.role === "VENDOR" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(contact)}
                className="p-1 rounded hover:bg-gray-700"
              >
                <Pencil size={16} className="text-white" />
              </button>
              <button
                onClick={() => handleDelete(contact.id!)} // Safe assertion since we checked above
                className="p-1 rounded hover:bg-gray-700"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
          )}
        </div>
        <p>
          General:{" "}
          <a href={`mailto:${contact.general}`} className="text-red-500">
            {contact.general}
          </a>
        </p>
        <p>
          Website Queries:{" "}
          <a href={`mailto:${contact.websiteQueries}`} className="text-red-500">
            {contact.websiteQueries}
          </a>
        </p>
        <p className="mt-2">Tel: {contact.telephone}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white text-xl">CONTACT US</h3>
        {user?.role === "VENDOR" && !isEditing && !showAddForm && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Plus size={16} />
            Add Office
          </button>
        )}
      </div>

      {showAddForm && renderForm(formData, true)}

      {contacts.map(contact => (
        <div key={contact.id || "new"}>
          {editingId === contact.id
            ? renderForm(formData)
            : renderContact(contact)}
        </div>
      ))}

      {!contacts.length && !showAddForm && (
        <p className="text-gray-400">No contact information available.</p>
      )}
    </div>
  );
};

export default ContactUs;
