// scripts/seed.js
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
    await prisma.product.create({
      data: {
        userId: user.id, // You need to provide a valid user ID here
        type: product.Type,
        sku: product.SKU,
        name: product.Name,
        published: Boolean(product.Published),
        isFeatured: Boolean(product["Is featured?"]),
        visibility: product["Visibility in catalogue"],
        shortDescription: product["Short description"],
        taxStatus: product["Tax status"],
        inStock: Boolean(product["In stock?"]),
        backordersAllowed: Boolean(product["Backorders allowed?"]),
        soldIndividually: Boolean(product["Sold individually?"]),
        allowReviews: Boolean(product["Allow customer reviews?"]),
        categories: product.Categories,
        tags: product.Tags,
        imageUrl: product.Images,
        upsells: product.Upsells,
        position: parseInt(product.Position),
        attribute1Name: product["Attribute 1 name"],
        attribute1Values: product["Attribute 1 value(s)"],
        attribute2Name: product["Attribute 2 name"],
        attribute2Values: product["Attribute 2 value(s)"],
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
