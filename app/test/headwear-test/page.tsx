import React from "react";
import { fetchHeadwearCategories } from "./actions";

const HeadwearPage = async () => {
  // Fetch the headwear categories on the server
  const { headwearCategories, error } = await fetchHeadwearCategories();

  if (error) {
    return <div>Failed to load headwear categories</div>;
  }

  // Default to an empty array if headwearCategories is undefined
  const safeHeadwearCategories = headwearCategories || [];

  return (
    <div>
      <h1 className="text-3xl">This is the database Headwear Categories</h1>
      <ul className="ml-8">
        {safeHeadwearCategories.length > 0 ? (
          safeHeadwearCategories.map((category, index) => (
            <li key={index}>{category}</li>
          ))
        ) : (
          <li>No headwear categories available</li>
        )}
      </ul>
    </div>
  );
};

export default HeadwearPage;
