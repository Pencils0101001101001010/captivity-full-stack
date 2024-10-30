// windows-service.js
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";
import { appendFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const POLLING_INTERVAL = 24 * 60 * 60 * 1000 * 7; // 7 days

// Simple logging function
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  const logFile = join(process.cwd(), isError ? "error.log" : "sync.log");

  try {
    appendFileSync(logFile, logMessage);
    console.log(message); // Also log to console
  } catch (err) {
    console.error("Logging failed:", err);
  }
}

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://www.captivity.co.za/wp-json/OrderCtrl/v4/products"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    log(`Fetch error: ${error.message}`, true);
    return null;
  }
}

async function upsertProduct(product) {
  if (!product.id || !product.product_name) {
    log(
      `Skipping product with ID ${product.id} due to missing required fields.`,
      true
    );
    return;
  }

  try {
    // First, delete existing related records
    await prisma.dynamicPricing.deleteMany({
      where: { productId: String(product.id) },
    });
    await prisma.variation.deleteMany({
      where: { productId: String(product.id) },
    });
    await prisma.featuredImage.deleteMany({
      where: { productId: String(product.id) },
    });

    // Then upsert the product
    await prisma.product.upsert({
      where: { id: String(product.id) },
      update: {
        productName: product.product_name,
        category: product.category,
        description: product.description,
        sellingPrice: product.selling_price,
        updatedAt: new Date(),
        dynamicPricing: {
          create: product.dynamic_pricing.map(pricing => ({
            from: pricing.from,
            to: pricing.to,
            type: pricing.type,
            amount: pricing.amount,
          })),
        },
        variations: {
          create: product.variations.map(variation => ({
            name: variation.name,
            color: variation.color,
            size: variation.size,
            sku: variation.sku,
            sku2: variation.sku2,
            variationImageURL: variation.variation_image_URL,
            quantity: variation.quantity,
          })),
        },
        featuredImage: product.featured_image
          ? {
              create: {
                thumbnail: product.featured_image.thumbnail,
                medium: product.featured_image.medium,
                large: product.featured_image.large,
              },
            }
          : undefined,
      },
      create: {
        id: String(product.id),
        userId: "342sdskb2fyuo4my",
        productName: product.product_name,
        category: product.category,
        description: product.description,
        sellingPrice: product.selling_price,
        isPublished: true,
        dynamicPricing: {
          create: product.dynamic_pricing.map(pricing => ({
            from: pricing.from,
            to: pricing.to,
            type: pricing.type,
            amount: pricing.amount,
          })),
        },
        variations: {
          create: product.variations.map(variation => ({
            name: variation.name,
            color: variation.color,
            size: variation.size,
            sku: variation.sku,
            sku2: variation.sku2,
            variationImageURL: variation.variation_image_URL,
            quantity: variation.quantity,
          })),
        },
        featuredImage: product.featured_image
          ? {
              create: {
                thumbnail: product.featured_image.thumbnail,
                medium: product.featured_image.medium,
                large: product.featured_image.large,
              },
            }
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    log(`Successfully synced product ${product.id}`);
  } catch (error) {
    log(`Error syncing product ${product.id}: ${error.message}`, true);
  }
}

async function syncProducts() {
  log("Starting product synchronization...");
  const products = await fetchProducts();

  if (products) {
    for (const product of products) {
      await upsertProduct(product);
    }
  }

  log("Product synchronization completed");
}

// Start the sync process
async function startService() {
  log("Service starting...");

  // Initial sync
  await syncProducts();

  // Set up recurring sync
  setInterval(async () => {
    await syncProducts();
  }, POLLING_INTERVAL);

  log(`Service running - polling every ${POLLING_INTERVAL / 1000} seconds`);
}

// Error handling
process.on("uncaughtException", error => {
  log(`Uncaught Exception: ${error.message}`, true);
});

process.on("unhandledRejection", error => {
  log(`Unhandled Rejection: ${error.message}`, true);
});

// Start the service
startService().catch(error => {
  log(`Service failed to start: ${error.message}`, true);
  process.exit(1);
});
