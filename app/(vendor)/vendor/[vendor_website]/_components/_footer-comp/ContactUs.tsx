import React from "react";

const ContactUs = () => {
  return (
    <div>
      <h3 className="font-bold mb-4 text-white">CONTACT US</h3>
      <p>
        General:{" "}
        <a href="mailto:info@captivity.co.za" className="text-red-500">
          info@captivity.co.za
        </a>
      </p>
      <p>
        Website Queries:{" "}
        <a href="mailto:web@captivity.co.za" className="text-red-500">
          web@captivity.co.za
        </a>
      </p>
      <div className="mt-4">
        <p className="font-bold">CAPE TOWN:</p>
        <p>Tel: +27 21- 510 3868</p>
      </div>
      <div className="mt-4">
        <p className="font-bold">JOHANNESBURG:</p>
        <p>Tel: +27 11- 608 3014</p>
      </div>
    </div>
  );
};

export default ContactUs;
