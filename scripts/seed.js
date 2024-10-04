import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const productsData = await fs.readFile(
    path.join(__dirname, "product-data.json"),
    "utf8"
  );
  const products = JSON.parse(productsData);

  for (const product of products) {
    // Check if the required fields are present
    if (!product.Name || !product.SKU) {
      console.warn(
        `Skipping product with ID ${product.ID} due to missing required fields.`
      );
      continue; // Skip this product if Name or SKU is missing
    }

    await prisma.product.create({
      data: {
        userId: "hoygueuc7dc73shj", // Ensure this is a valid user ID
        type: product.Type,
        sku: product.SKU,
        name: product.Name,
        published: Boolean(product.Published),
        isFeatured: Boolean(product["Is featured?"]),
        visibility: product["Visibility in catalogue"],
        shortDescription: product["Short description"] || "", // Use an empty string if missing
        taxStatus: product["Tax status"],
        inStock: Boolean(product["In stock?"]),
        backordersAllowed: Boolean(product["Backorders allowed?"]),
        soldIndividually: Boolean(product["Sold individually?"]),
        allowReviews: Boolean(product["Allow customer reviews?"]),
        categories: product.Categories || "", // Use an empty string if missing
        tags: product.Tags || "", // Use an empty string if missing
        imageUrl: product.Images || "", // Use an empty string if missing
        upsells: product.Upsells || null, // Use null if missing
        position: parseInt(product.Position) || 0, // Default to 0 if missing or invalid
        attribute1Name: product["Attribute 1 name"] || null,
        attribute1Values: product["Attribute 1 value(s)"] || null,
        attribute2Name: product["Attribute 2 name"] || null,
        attribute2Values: product["Attribute 2 value(s)"] || null,
        regularPrice: product["Regular price"]
          ? parseFloat(product["Regular price"])
          : null,
        stock: product.Stock ? parseInt(product.Stock) : null,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
