import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to format the description
export const formatDescription = (description: string) => {
  let formattedDesc = description.replace(/\\n/g, "");
  const lines = formattedDesc.split("*").filter((line) => line.trim() !== "");
  const listItems = lines.map((line) => `<li>${line.trim()}</li>`).join("");
  formattedDesc = `<ul>${listItems}</ul>`;
  formattedDesc = formattedDesc.replace(
    /<li>(Recommended Branding:.*?)<\/li>/,
    "</ul><p><strong>$1</strong></p>"
  );
  return { __html: formattedDesc };
};