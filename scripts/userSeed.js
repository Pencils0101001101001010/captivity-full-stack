import { PrismaClient } from "@prisma/client";
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

// Function to hash password using Argon2
async function hashPassword(password) {
  try {
    // Using Argon2 with recommended settings
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64MB
      timeCost: 3, // Number of iterations
      parallelism: 4,
      saltLength: 16,
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
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
      const [streetAddress, addressLine2] = user.address.billing_address_1
        .split(",")
        .map(s => s.trim());

      // Generate a secure hash from the WordPress password hash
      // Since the WP password is already hashed, we'll create a new secure hash
      const securePassword = await hashPassword(user.password);

      await prisma.user.create({
        data: {
          id: uuidv4(), // Generate new UUID
          wpId: String(user.id), // Store original WordPress ID
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          displayName: user.display_name,
          email: user.email,
          passwordHash: securePassword, // Store the Argon2 hashed password
          vatNumber: user.vat_number || null,
          phoneNumber: parseInt(user.user_registration_phone_number) || 0,
          streetAddress: streetAddress,
          addressLine2: user.address.billing_address_2 || null,
          suburb: addressLine2 || null,
          townCity: user.address.billing_city,
          postcode: user.address.billing_postcode,
          country: user.address.billing_country,
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
          createdAt: new Date(user.user_registered),
          updatedAt: new Date(),
        },
      });

      console.log(`Created user: ${user.username} (WordPress ID: ${user.id})`);
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
