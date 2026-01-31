import { PrismaClient } from '@prisma/client';

export async function seedRoleHierarchy(prisma: PrismaClient) {
    console.log('🌱 Seeding role hierarchy...')
    
    const roles = await prisma.role.findMany();

    const roleMap = Object.fromEntries(
        roles.map(r => [r.name, r])
    );

    const relations: Array<{ parent: string; child: string }> = [
        { parent: 'ADMIN', child: 'VET' },
        { parent: 'VET', child: 'VOLUNTEER' },
    ];

    for (const relation of relations) {
        const parentRole = roleMap[relation.parent];
        const childRole = roleMap[relation.child];

        if (!parentRole || !childRole) {
            throw new Error(`Roles not found for hierarchy seeding: ${relation.parent} or ${relation.child}`);
        }
        await prisma.roleHierarchy.upsert({
            where: {
                parentRoleId_childRoleId: {
                    parentRoleId: parentRole.id,
                    childRoleId: childRole.id,
                },
            },
            update: {},
            create: {
                parentRoleId: parentRole.id,
                childRoleId: childRole.id,
            },
        });
    };

    console.log('✅ Role hierarchy seeded');
};