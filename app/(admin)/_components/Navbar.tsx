"use client";

import { useState } from "react";
import UserButton from "./UserButton";
import Sidebar from "./Sidebar";
import React from "react";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style jsx global>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background-color: var(--card-bg);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          max-width: 100%;
          overflow-x: auto;
        }
        .navbar-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
          white-space: nowrap;
          margin-right: 1rem;
        }
        .user-button-wrapper {
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .navbar-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
      <header className="navbar-container">
        <div className="navbar-content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              className="mr-4 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24">
                <path
                  d="M4 6h16M4 12h16m-7 6h7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="navbar-title">ADMIN DASHBOARD</div>
          </div>
          <div className="user-button-wrapper">
            <UserButton />
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed bottom-0 left-0 top-0 w-64 bg-white p-5">
            <Sidebar />
          </div>
        </div>
      )}
      {/* Add a spacer to prevent content from being hidden under the fixed navbar */}
      <div style={{ height: '60px' }}></div>
    </>
  );
}