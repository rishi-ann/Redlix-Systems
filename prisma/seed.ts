import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- Starting Seeding Process ---');

    // 1. Create a Test Developer
    const developer = await prisma.developer.upsert({
        where: { id: 'dev-test-123' },
        update: {},
        create: {
            id: 'dev-test-123',
            email: 'dev@csapp.com'
        }
    });
    console.log('✔ Developer created:', developer.email);

    // 2. Create a Test Client
    const client = await prisma.client.upsert({
        where: { id: 'RED-8856' },
        update: {},
        create: {
            id: 'RED-8856',
            name: 'Acme Corp (Test)',
            email: 'client@acme.com',
            developers: {
                connect: { id: developer.id }
            }
        }
    });
    console.log('✔ Client created:', client.id);

    console.log('--- Seeding Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error('✘ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
