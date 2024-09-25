import React from "react";
import { fetchCategories } from "./actions";

// To view this data..... Click the test links => Note: This data must be injected into a component that maps through the lists in the categories. Lmbimp you probably want me to do that neh......

const Page = async () => {
  // Fetch the categories on the server
  const { categories, error } = await fetchCategories();

  if (error) {
    return <div>Failed to load categories</div>;
  }

  // Default to an empty array if categories is undefined
  const safeCategories = categories || [];

  return (
    <div>
      <h1 className="text-3xl">This is the database product Categories</h1>
      <ul className="ml-8">
        {safeCategories.length > 0 ? (
          safeCategories.map((category, index) => (
            <li key={index}>{category}</li>
          ))
        ) : (
          <li>No categories available</li>
        )}
      </ul>
    </div>
  );
};

export default Page;