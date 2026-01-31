import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
    const roles = [
        { name: 'ADMIN', description: 'System administrator' },
        { name: 'VET', description: 'Veterinarian' },
        { name: 'VOLUNTEER', description: 'Shelter volunteer' },
    ];

    for (const role of roles){
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }

    console.log('✅ Roles seeded');
};