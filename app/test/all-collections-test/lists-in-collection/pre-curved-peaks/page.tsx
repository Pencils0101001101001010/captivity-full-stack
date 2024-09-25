import React from "react";
import { fetchPreCurvedPeaks } from "./actions"; // Adjust the path as necessary
import Link from "next/link";

const PreCurvedPeaksPage = async () => {
  // Fetch Pre-Curved Peaks on the server
  const { preCurvedPeaksUnderLeisure = [], error } =
    await fetchPreCurvedPeaks(); // Ensure default empty array

  if (error) {
    return <div>Failed to load Pre-Curved Peaks</div>;
  }

  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-3xl">Pre-Curved Peaks Under Leisure Collection</h1>

        {preCurvedPeaksUnderLeisure.length > 0 ? (
          <ul className="ml-8">
            {preCurvedPeaksUnderLeisure.map((product, index) => (
              <li key={index} className="my-2">
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Pre-Curved Peaks available under Leisure Collection.</p>
        )}
      </div>
    </div>
  );
};

export default PreCurvedPeaksPage;
