import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

// Sample user data
const userData = [
  {
    id: 1,
    username: "admin2020",
    password: "$P$Bub/avWDE/XTGNtebRoSiruU4EFx5g.",
    display_name: "admin2020",
    email: "stanton@assetflow.co.za",
    user_registered: "2016-02-03 12:38:11",
    first_name: "Stanton",
    last_name: "Hermanus",
    user_registration_phone_number: "",
    user_registration_company_name: "",
    vat_number: "",
    ck_number: "",
    nature_of_business: "",
    current_supplier: "",
    website: "",
    position: "",
    address: {
      billing_address_1: "42 Ernest Esau street",
      billing_address_2: "Ravensmead",
      billing_city: "Cape Town",
      billing_postcode: "7493",
      billing_country: "ZA",
    },
    billing_salesrep: "",
    roles: ["administrator"],
  },
];

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

function generateId() {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

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
    for (const user of userData) {
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
            id: generateId(),
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
