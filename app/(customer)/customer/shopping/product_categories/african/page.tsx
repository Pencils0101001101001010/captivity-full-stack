// shopping/(product_categories)/summer/page.tsx
import React from "react";
import AfricanCollectionPage from "./AfricanLanding";

export default async function AfricanPage(): Promise<JSX.Element> {
  return (
    <div className="bg-orange-300">
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground text-orange-300">
            African Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our latest african styles and seasonal favorites
          </p>
        </div>
      </div>
      <AfricanCollectionPage />
    </div>
  );
}
