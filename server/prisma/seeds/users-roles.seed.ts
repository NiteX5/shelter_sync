import { PrismaClient } from '@prisma/client';

export async function seedUsersRoles(prisma: PrismaClient, users: Array<{ id: string; email: string; username: string; passwordHash: string;}>) {

    console.log('🌱 Seeding users-roles relationships...');

    const [adminRole, vetRole, volunteerRole] = await Promise.all([
        prisma.role.findUnique({ where: { name: 'ADMIN' } }),
        prisma.role.findUnique({ where: { name: 'VET' } }),
        prisma.role.findUnique({ where: { name: 'VOLUNTEER' } }),
    ]);

    if (users.length === 0) {
        throw new Error('No se encontraron usuarios para asignar roles');
    }

    for (const user of users) {
        switch (user.username) {
            case 'Admin':
                if (!adminRole) {
                   throw new Error('Rol ADMIN no encontrado'); 
                }
                await prisma.userRole.upsert({
                        where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
                        update: {},
                        create: { userId: user.id, roleId: adminRole.id },
                });
                console.log(`Asignado rol ADMIN al usuario ${user.username}`);
                break;
            case 'Vet':
                if (!vetRole) {
                    throw new Error('Rol VET no encontrado');
                }
                await prisma.userRole.upsert({
                    where: { userId_roleId: { userId: user.id, roleId: vetRole.id } },
                    update: {},
                    create: { userId: user.id, roleId: vetRole.id },
                });
                console.log(`Asignado rol VET al usuario ${user.username}`);
                break;
            case 'Volunteer':
                if (!volunteerRole) {
                    throw new Error('Rol VOLUNTEER no encontrado');
                }
                await prisma.userRole.upsert({
                    where: { userId_roleId: { userId: user.id, roleId: volunteerRole.id } },
                    update: {},
                    create: { userId: user.id, roleId: volunteerRole.id },
                });
                console.log(`Asignado rol VOLUNTEER al usuario ${user.username}`);
                break;

            default:
                console.warn(`⚠️ Usuario con nombre de usuario desconocido: ${user.username}`);
        }       
    }

    console.log('✅ Users-roles relationships seeded');
};