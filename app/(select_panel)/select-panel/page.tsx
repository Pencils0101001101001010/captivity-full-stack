"use client";

import { useRouter } from "next/navigation";

const panels = [
  { name: "Customer Panel", path: "/customer" },
  { name: "Subscriber Panel", path: "/subscriber" },
  { name: "Promo Panel", path: "/promo" },
  { name: "Distributor Panel", path: "/distributor" },
  { name: "Shop Manager Panel", path: "/shop" },
  { name: "Editor Panel", path: "/editor" },
  { name: "Admin Panel", path: "/admin" },
];

export default function SelectPanel() {
  const router = useRouter();

  const handlePanelSelect = (path: string) => {
    // Extract the panel name from the path and use it as the role
    const role = path.substring(1).toUpperCase();
    router.push(`${path}?as=${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Panel</h1>
        <div className="space-y-4">
          {panels.map(panel => (
            <button
              key={panel.path}
              onClick={() => handlePanelSelect(panel.path)}
              className="w-full p-4 text-left hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors"
            >
              {panel.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
