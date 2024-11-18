"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { useParams } from "next/navigation";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { OpeningHoursInfo } from "../../welcome/_actions/officeLocation-actions";
import { useOpeningHoursData } from "../../welcome/_store/officeLocationStore";

interface OpeningHoursFormData {
  city: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
}

interface RenderHoursProps {
  hours: OpeningHoursInfo;
  onEdit: (hours: OpeningHoursInfo) => void;
  onDelete: (id: string) => void;
  isVendor: boolean;
}

interface RenderFormProps {
  data: OpeningHoursFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const RenderHours: React.FC<RenderHoursProps> = ({
  hours,
  onEdit,
  onDelete,
  isVendor,
}) => (
  <div className="mb-6 p-4 bg-gray-800 rounded-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-white text-lg">
        {hours.officeLocation.city}:
      </h3>
      {isVendor && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(hours)}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors"
            title="Edit hours"
          >
            <Pencil size={16} className="text-white" />
          </button>
          <button
            onClick={() => onDelete(hours.id)}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors"
            title="Delete hours"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        </div>
      )}
    </div>
    <div className="space-y-2">
      <p className="text-gray-300">
        <span className="font-medium">Mon – Thu:</span> {hours.mondayToThursday}
      </p>
      <p className="text-gray-300">
        <span className="font-medium">Friday:</span> {hours.friday}
      </p>
      <p className="text-gray-300">
        <span className="font-medium">Saturday – Sunday:</span>{" "}
        {hours.saturdaySunday}
      </p>
      <p className="text-gray-300">
        <span className="font-medium">Public Holidays:</span>{" "}
        {hours.publicHolidays}
      </p>
    </div>
  </div>
);

const RenderForm: React.FC<RenderFormProps> = ({
  data,
  onSubmit,
  onChange,
  onCancel,
}) => (
  <form
    onSubmit={onSubmit}
    className="space-y-4 bg-gray-800 p-4 rounded-lg mt-4"
  >
    <div>
      <label className="block text-sm font-medium text-white">City</label>
      <input
        type="text"
        name="city"
        value={data.city}
        onChange={onChange}
        placeholder="e.g. Cape Town"
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-white">
        Monday to Thursday
      </label>
      <input
        type="text"
        name="mondayToThursday"
        value={data.mondayToThursday}
        onChange={onChange}
        placeholder="e.g. 8 am – 5 pm"
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-white">Friday</label>
      <input
        type="text"
        name="friday"
        value={data.friday}
        onChange={onChange}
        placeholder="e.g. 8 am – 4 pm"
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-white">
        Saturday and Sunday
      </label>
      <input
        type="text"
        name="saturdaySunday"
        value={data.saturdaySunday}
        onChange={onChange}
        placeholder="e.g. Closed"
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-white">
        Public Holidays
      </label>
      <input
        type="text"
        name="publicHolidays"
        value={data.publicHolidays}
        onChange={onChange}
        placeholder="e.g. Closed"
        className="mt-1 w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        required
      />
    </div>
    <div className="flex gap-2">
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        <Save size={16} />
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        <X size={16} />
        Cancel
      </button>
    </div>
  </form>
);

const OpeningHours: React.FC = () => {
  const { user } = useSession();
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  const {
    openingHours,
    isLoading,
    error,
    createOpeningHours,
    updateOpeningHours,
    deleteOpeningHours,
  } = useOpeningHoursData(vendorWebsite);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<OpeningHoursFormData>({
    city: "",
    mondayToThursday: "",
    friday: "",
    saturdaySunday: "Closed",
    publicHolidays: "Closed",
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (hours: OpeningHoursInfo) => {
    setFormData({
      city: hours.officeLocation.city,
      mondayToThursday: hours.mondayToThursday,
      friday: hours.friday,
      saturdaySunday: hours.saturdaySunday,
      publicHolidays: hours.publicHolidays,
    });
    setEditingId(hours.id);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setFormData({
      city: "",
      mondayToThursday: "",
      friday: "",
      saturdaySunday: "Closed",
      publicHolidays: "Closed",
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowAddForm(false);
    setEditingId(undefined);
    setFormData({
      city: "",
      mondayToThursday: "",
      friday: "",
      saturdaySunday: "Closed",
      publicHolidays: "Closed",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateOpeningHours(editingId, formData);
        toast.success("Opening hours updated successfully");
      } else {
        await createOpeningHours(vendorWebsite, formData);
        toast.success("Opening hours added successfully");
      }
      handleCancel();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save opening hours";
      console.error("Error saving opening hours:", error);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete these opening hours?")
    ) {
      try {
        await deleteOpeningHours(id);
        toast.success("Opening hours deleted successfully");
      } catch (error) {
        toast.error("Failed to delete opening hours");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-white">Loading opening hours...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white text-xl">TRADING HOURS</h3>
        {user?.role === "VENDOR" && !isEditing && !showAddForm && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            Add Trading Hours
          </button>
        )}
      </div>

      {showAddForm && (
        <RenderForm
          data={formData}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onCancel={handleCancel}
        />
      )}

      <div className="space-y-4">
        {openingHours.map(hours => (
          <div key={hours.id}>
            {editingId === hours.id ? (
              <RenderForm
                data={formData}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onCancel={handleCancel}
              />
            ) : (
              <RenderHours
                hours={hours}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isVendor={user?.role === "VENDOR"}
              />
            )}
          </div>
        ))}
      </div>

      {!openingHours.length && !showAddForm && (
        <div className="text-center py-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400">
            {user?.role === "VENDOR"
              ? "No trading hours added yet."
              : "No trading hours available from the vendor."}
          </p>
        </div>
      )}
    </div>
  );
};

export default OpeningHours;
