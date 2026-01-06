require("dotenv").config();
console.log("DATABASE_URL present?", !!process.env.DATABASE_URL);
console.log("DATABASE_URL starts with:", (process.env.DATABASE_URL || "").slice(0, 30));
