import React from "react";
import Link from "next/link";
import FollowUs from "./_footer-comp/FollowUs";
import Information from "./_footer-comp/Information";
import ContactUs from "./_footer-comp/ContactUs";
import OpeningHours from "./_footer-comp/OpeningHours";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 font-sans text-xs py-20 w-full">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <FollowUs />
        <Information />
        <ContactUs />
        <OpeningHours />
      </div>
      <div className="container mx-auto text-center mt-10">
        <Link href="https://captivity.co.za/contact/">
          <button className="bg-transparent border-2 border-slate-400 text-white hover:bg-red-700 hover:border-red-700 py-2 px-4">
            OUR OFFICES
          </button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
