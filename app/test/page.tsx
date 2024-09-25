import React from "react";
import { fetchCategories } from "./actions";

// Mocked description data for the category
const description = `
<ul>
  <li>Enzyme Washed Cotton (100%)</li>
  <li>6 Panel Unstructured</li>
  <li>Embroidered Eyelets</li>
  <li>Pre-Curved Peak</li>
  <li>Self Fabric Velcro Strap (except for colours: <strong>Fuchsia, Turquoise & Cobalt Blue</strong>)</li>
  <li>Brass Clasp BUCKLE, only (<strong>Fuchsia, Turquoise & Cobalt Blue)</strong>)</li>
  <li>Low Profile</li>
  <li>Branding Area: 100mm x 50mm</li>
</ul>
<strong>Recommended Branding: Embroidery</strong>
`;

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
      <h1>Categories</h1>
      <ul>
        {safeCategories.length > 0 ? (
          safeCategories.map((category, index) => (
            <li key={index}>{category}</li>
          ))
        ) : (
          <li>No categories available</li>
        )}
      </ul>

      {/* Render the description */}
      <h2>Pre-Curved Peaks Description</h2>
      <div
        dangerouslySetInnerHTML={{ __html: description }} // Render the description HTML
      ></div>
    </div>
  );
};

export default Page;
