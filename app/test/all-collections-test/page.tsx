import React from "react";
import { fetchGroupedCategories } from "./actions";

const GroupedCategoriesPage = async () => {
  // Fetch grouped categories on the server
  const { groupedCategories, error } = await fetchGroupedCategories();

  if (error) {
    return <div>Failed to load categories</div>;
  }

  const { headwear = [], apparel = [], other = [] } = groupedCategories || {};

  return (
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

      <h2 className="text-2xl mt-4">Other Categories</h2>
      <ul className="ml-8">
        {other.length > 0 ? (
          other.map((category, index) => <li key={index}>{category}</li>)
        ) : (
          <li>No other categories available</li>
        )}
      </ul>
    </div>
  );
};

export default GroupedCategoriesPage;
