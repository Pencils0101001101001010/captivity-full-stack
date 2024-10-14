import React from "react";
import ClothingCollections from "./ClothingCollections";
import LatestProducts from "./LatestProducts";

const CustomerExpressLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Our Store
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Our Collections
            </h2>
            <ClothingCollections />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Latest Products
            </h2>
            <LatestProducts />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2023 Your Company Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerExpressLandingPage;
