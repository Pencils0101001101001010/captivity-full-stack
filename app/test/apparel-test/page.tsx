import React from "react";
import { fetchApparelCategories } from "./actions";

const ApparelPage = async () => {
  // Fetch the apparel categories on the server
  const { apparelCategories, error } = await fetchApparelCategories();

  if (error) {
    return <div>Failed to load apparel categories</div>;
  }

  // Default to an empty array if apparelCategories is undefined
  const safeApparelCategories = apparelCategories || [];

  return (
    <div>
      <h1 className="text-3xl">This is the database Apparel Categories</h1>
      <ul className="ml-8">
        {safeApparelCategories.length > 0 ? (
          safeApparelCategories.map((category, index) => (
            <li key={index}>{category}</li>
          ))
        ) : (
          <li>No apparel categories available</li>
        )}
      </ul>
    </div>
  );
};

export default ApparelPage;
