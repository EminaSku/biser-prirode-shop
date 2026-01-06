const bcrypt = require("bcrypt");
const prisma = require("../src/prisma");

async function main() {
  const adminEmail = "admin@minishop.com";
  const adminPass = "Admin123!";

  const passwordHash = await bcrypt.hash(adminPass, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.product.createMany({
    data: [
      { name: "Blue Hoodie", description: "Comfort hoodie", price: 3999, stock: 12, category: "Hoodies" },
      { name: "Winter Jacket", description: "Warm long jacket", price: 8999, stock: 5, category: "Jackets" },
      { name: "Kids Coat", description: "Kids winter coat", price: 5999, stock: 8, category: "Kids" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed done");
  console.log("ADMIN LOGIN ->", adminEmail, adminPass);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
