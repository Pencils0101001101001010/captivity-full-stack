import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const FollowUs = () => {
  return (
    <div className="mx-5">
      <h3 className="font-bold mb-4 text-white">FOLLOW US</h3>
      <ul>
        <li className="mb-2 flex items-center">
          <FaInstagram className="icons instagram text-white hover:text-gray-500" />
          <a
            href="https://www.instagram.com/fwrdheadwearapparelza/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 hover:text-red-600"
          >
            Instagram
          </a>
        </li>
        <li className="mb-2 flex items-center">
          <FaFacebook className="icons facebook text-white hover:text-gray-500" />
          <a
            href="https://www.facebook.com/CaptivityHeadwearApparel/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 hover:text-red-600"
          >
            Facebook
          </a>
        </li>
        <li className="mb-2 flex items-center">
          <FaYoutube className="icons youtube text-white hover:text-gray-500" />
          <a
            href="https://www.youtube.com/channel/UCCY1jcwbOK-DXEfmMI5a77Q"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 hover:text-red-600"
          >
            Youtube
          </a>
        </li>
      </ul>
    </div>
  );
};

export default FollowUs;
