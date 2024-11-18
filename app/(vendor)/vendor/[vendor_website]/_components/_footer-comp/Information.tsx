import React from "react";
import Link from "next/link";

const Information = () => {
  return (
    <div>
      <h3 className="font-bold mb-4 text-white">INFORMATION</h3>
      <ul>
        <li className="mb-2 hover:text-red-600">
          <Link href="/about">About</Link>
        </li>
        <li className="mb-2 hover:text-red-600">
          <Link href="/Help">Help</Link>
        </li>
        <li className="mb-2 hover:text-red-600">
          <Link href="/contact">Contact Us</Link>
        </li>
        <li className="mb-2 hover:text-red-600">
          <Link href="/custom-orders">Custom Orders</Link>
        </li>
        <li className="mb-2 hover:text-red-600">
          <Link href="/info-act">Information Act</Link>
        </li>
        <li className="mb-2 hover:text-red-600">
          <Link href="/terms-conditions">Terms & Conditions</Link>
        </li>
        <li className="mb-2 hover:text-red-600">
          <Link href="/international-tolerances">
            International Tolerances on Apparel
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Information;
