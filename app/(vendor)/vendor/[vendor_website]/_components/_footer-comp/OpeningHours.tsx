import React from "react";

const OpeningHours = () => {
  return (
    <div>
      <h3 className="font-bold mb-4 text-white">OPENING HOURS</h3>
      <div className="mb-4">
        <p className="font-bold">CAPE TOWN:</p>
        <p>Mon – Thu: 8 am – 5 pm</p>
        <p>Friday: 8 am – 4 pm</p>
        <p>Saturday – Sunday: Closed</p>
        <p>Public Holidays: Closed</p>
      </div>
      <div>
        <p className="font-bold">JOHANNESBURG:</p>
        <p>Mon – Thu: 7 am – 5 pm</p>
        <p>Friday: 7 am – 4 pm</p>
        <p>Saturday – Sunday: Closed</p>
        <p>Public Holidays: Closed</p>
      </div>
    </div>
  );
};

export default OpeningHours;
