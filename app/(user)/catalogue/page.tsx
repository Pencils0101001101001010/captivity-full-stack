import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <div className="flex justify-center items-center py-10">
        <Image
          width={395}
          height={520}
          alt="Cataloague"
          src="/Catalogue-2024-v2.jpg"
        />
      </div>
    </div>
  );
};

export default page;
