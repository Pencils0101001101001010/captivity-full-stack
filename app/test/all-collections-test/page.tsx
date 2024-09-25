import React from "react";
import { fetchGroupedCategories } from "./actions";
import Link from "next/link";

const GroupedCategoriesPage = async () => {
  // Fetch grouped categories on the server
  const { groupedCategories, error } = await fetchGroupedCategories();

  if (error) {
    return <div>Failed to load categories</div>;
  }

  const { headwear = [], apparel = [], other = [] } = groupedCategories || {};

  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-3xl">Categories Grouped by Collections</h1>

        <h2 className="text-2xl mt-4">Headwear Collection</h2>
        <ul className="ml-8">
          {headwear.length > 0 ? (
            headwear.map((category, index) => <li key={index}>{category}</li>)
          ) : (
            <li>No headwear categories available</li>
          )}
        </ul>

        <h2 className="text-2xl mt-4">Apparel Collection</h2>
        <ul className="ml-8">
          {apparel.length > 0 ? (
            apparel.map((category, index) => <li key={index}>{category}</li>)
          ) : (
            <li>No apparel categories available</li>
          )}
        </ul>

        <h2 className="text-2xl mt-4">Other Category Collections</h2>
        <ul className="ml-8">
          {other.length > 0 ? (
            other.map((category, index) => <li key={index}>{category}</li>)
          ) : (
            <li>No other categories available</li>
          )}
        </ul>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          className="btn"
          href={`${process.env.BASE_URL}/leisure-collection`}
        >
          Leasure Collection
        </Link>
        <Link className="btn" href={`${process.env.BASE_URL}/pre-curved-peaks`}>
          Pre-curved Peaks
        </Link>
        <Link className="btn" href={`${process.env.BASE_URL}/sport-collection`}>
          Sport Collection
        </Link>
        <Link className="btn" href={`${process.env.BASE_URL}/special-offers`}>
          Special Ofers
        </Link>
      </div>
    </div>
  );
};

export default GroupedCategoriesPage;
