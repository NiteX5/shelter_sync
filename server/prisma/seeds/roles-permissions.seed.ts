import { PrismaClient } from "@prisma/client";

export async function seedRolePermissions(prisma: PrismaClient) {
    console.log('🌱 Seeding role-permissions...');

    const [roles, permissions] = await Promise.all([
        prisma.role.findMany(),
        prisma.permission.findMany(),
    ]);

    const roleMap = Object.fromEntries(
        roles.map(r  => [r.name, r])
    );

    const perMap = Object.fromEntries(
        permissions.map(p => [p.slug, p])
    );

    if (!roleMap['ADMIN'] || !roleMap['VET'] || !roleMap['VOLUNTEER']) {
        throw new Error('Roles not found. Make sure roles are seeded before seeding role-permissions.');
    }

    const assignments : Record<string, string[]> = {
        VOLUNTEER: [
            'adoptions.read'
        ],
        VET: [
            'animals.read',
            'animals.write',
            'medical.read',
            'medical.write',
            'medical.edit',
            'animal.edit',
            'animal.enter',
            'adoptions.read',
        ],
        ADMIN: permissions.map(p => p.slug),
    };

    for (const [roleName, permSlugs] of Object.entries(assignments)) {

        const role = roleMap[roleName];

        for (const slug of permSlugs) {
            const permission = perMap[slug];
            if (!permission) {
                console.warn(`⚠️ Permission with slug ${slug} not found, skipping assignment to role ${roleName}`);
                continue;
            }

            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: role.id,
                    permissionId: permission.id,
                    scope: 'ALL'
                },
            });
        };
    };

    console.log('✅ Role-permissions seeded');

};