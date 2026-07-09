require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma/client');

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const workstation1 = await prisma.workstation.createMany({
    data: [
      { location: 'cluster north', label: 'c1r1s1' },
      { location: 'cluster north', label: 'c1r1s2' },
      { location: 'cluster north', label: 'c1r1s3' },
      { location: 'cluster north', label: 'c1r1s4' },
      { location: 'cluster north', label: 'c1r1s5' },
      { location: 'cluster north', label: 'c1r1s6' },
      { location: 'cluster north', label: 'c1r1s7' },
      { location: 'cluster north', label: 'c1r1s8' },
      { location: 'cluster south', label: 'c2r1s1' },
      { location: 'cluster south', label: 'c2r1s2' },
      { location: 'cluster south', label: 'c2r1s3' },
      { location: 'cluster south', label: 'c2r1s4' },
      { location: 'cluster south', label: 'c2r1s5' },
      { location: 'cluster south', label: 'c2r1s6' },
      { location: 'cluster south', label: 'c2r1s7' },
      { location: 'cluster south', label: 'c2r1s8' },
    ],
    skipDuplicates: true,
  });
  console.log(workstation1);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
