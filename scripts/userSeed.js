import { PrismaClient, Prisma } from "@prisma/client";
import fetch from "node-fetch";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

function mapWordPressRoleToPrisma(wpRole) {
  const roleMapping = {
    administrator: "ADMIN",
    editor: "EDITOR",
    shop_manager: "SHOPMANAGER",
    customer: "CUSTOMER",
    subscriber: "SUBSCRIBER",
    contributor: "USER",
    distributor: "DISTRIBUTOR",
    promotional: "PROMO",
  };

  return roleMapping[wpRole.toLowerCase()] || "USER";
}

// Function to generate 16-character ID matching your schema format
function generateId() {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// Rest of your functions...
async function hashPassword(password) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      saltLength: 16,
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

function getValidDate(dateString) {
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}

async function main() {
  try {
    const response = await fetch(
      "https://captivity.co.za/wp-json/wp-users-api/v2/all-users"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const users = await response.json();

    for (const user of users) {
      const role = mapWordPressRoleToPrisma(user.roles[0]);

      const billingAddress = user.address?.billing_address_1 || "";
      const [streetAddress, addressLine2] = billingAddress
        .split(",")
        .map(s => s?.trim() || "");

      const securePassword = await hashPassword(user.password);

      const phoneNumber = user.user_registration_phone_number
        ? user.user_registration_phone_number.replace(/\D/g, "")
        : "";

      const createdAt = getValidDate(user.user_registered);
      const currentDate = new Date();

      try {
        await prisma.user.create({
          data: {
            id: generateId(), // Now generates exact 16-character format
            wpId: String(user.id),
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            displayName: user.display_name,
            email: user.email,
            passwordHash: securePassword,
            vatNumber: user.vat_number || null,
            phoneNumber,
            streetAddress: streetAddress || "",
            addressLine2: user.address?.billing_address_2 || null,
            suburb: addressLine2 || null,
            townCity: user.address?.billing_city || "",
            postcode: user.address?.billing_postcode || "",
            country: user.address?.billing_country || "",
            position: user.position || null,
            natureOfBusiness: user.nature_of_business || "Not specified",
            currentSupplier: user.current_supplier || "Not specified",
            otherSupplier: null,
            resellingTo: null,
            salesRep: user.billing_salesrep || "Not assigned",
            website: user.website || null,
            companyName: user.user_registration_company_name || "Not specified",
            ckNumber: user.ck_number || null,
            avatarUrl: null,
            bio: null,
            agreeTerms: true,
            role: role,
            createdAt,
            updatedAt: currentDate,
          },
        });

        console.log(
          `Created user: ${user.username} (WordPress ID: ${user.id})`
        );
      } catch (error) {
        console.error(`Error creating user ${user.username}:`, error);
        throw error;
      }
    }

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
