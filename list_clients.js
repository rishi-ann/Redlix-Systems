const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const clients = await prisma.client.findMany();
    console.log("Existing Clients:");
    clients.forEach(c => console.log(`- ${c.name} (ID: ${c.id})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
