import { PrismaClient as SQLiteClient } from "../generated/sqlite";
import { PrismaClient as PgClient } from "../generated/postgres/client";

const sqlite = new SQLiteClient({
  datasources: { db: { url: process.env.SQLITE_URL } },
});

const pg = new PgClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function main() {
  console.log("🔥 migrate.ts is running");
  console.log("Starting migration...");

  // 1. Users
  const users = await sqlite.user.findMany();
  console.log("SQLite users:", users.length);
  for (const u of users) {
    await pg.user.upsert({
      where: { id: u.id },
      update: u,
      create: u,
    });
  }
  console.log("✅ Users migrated");

  // 2. Vendor Profiles
  // 2. Vendor Profiles
const vendors = await sqlite.vendorProfile.findMany();
for (const v of vendors) {
  await pg.vendorProfile.upsert({
    where: { userId: v.userId }, // 👈 UNIQUE FIELD
    update: v,
    create: v,
  });
}
console.log("✅ VendorProfiles migrated");


  // 3. Services
  const services = await sqlite.service.findMany();
  for (const s of services) {
    await pg.service.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log("✅ Services migrated");

  // 4. Packages
  const packages = await sqlite.package.findMany();
  for (const p of packages) {
    await pg.package.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log("✅ Packages migrated");

  // 5. Events
  const events = await sqlite.event.findMany();
  for (const e of events) {
    await pg.event.upsert({
      where: { id: e.id },
      update: e,
      create: e,
    });
  }
  console.log("✅ Events migrated");

  // 6. Bookings
  const bookings = await sqlite.booking.findMany();
  for (const b of bookings) {
    await pg.booking.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }
  console.log("✅ Bookings migrated");

  // 7. Quotes
  const quotes = await sqlite.quote.findMany();
  for (const q of quotes) {
    await pg.quote.upsert({
      where: { id: q.id },
      update: q,
      create: q,
    });
  }
  console.log("✅ Quotes migrated");

  // 8. Payments
  const payments = await sqlite.payment.findMany();
  for (const p of payments) {
    await pg.payment.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log("✅ Payments migrated");

  // 9. Reviews
  const reviews = await sqlite.review.findMany();
  for (const r of reviews) {
    await pg.review.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }
  console.log("✅ Reviews migrated");

  // 10. Messages
  const messages = await sqlite.message.findMany();
  for (const m of messages) {
    await pg.message.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log("✅ Messages migrated");

  // 11. Availability
  const availability = await sqlite.availability.findMany();
  for (const a of availability) {
    await pg.availability.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }
  console.log("✅ Availability migrated");
}

main()
  .then(async () => {
    await sqlite.$disconnect();
    await pg.$disconnect();
    console.log("🎉 Migration finished");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ Migration failed", e);
    await sqlite.$disconnect();
    await pg.$disconnect();
    process.exit(1);
  });
