import { prisma } from '../src/prisma/prisma.client';
import { seedRoles } from './seeds/roles.seed';
import { seedPermissions } from './seeds/permissions.seed';
import { seedUsers } from './seeds/users.seed';
import { seedUsersRoles } from './seeds/users-roles.seed';
import { seedRolePermissions } from './seeds/roles-permissions.seed';
import { seedRoleHierarchy } from './seeds/role-hierarchy.seed';

async function main() {
  console.log('🌱 Seeding database...');

  await seedRoles(prisma);

  await seedPermissions(prisma);

  const users = await seedUsers(prisma);

  await seedUsersRoles(prisma, users);

  await seedRolePermissions(prisma);

  await seedRoleHierarchy(prisma);

  console.log('✅ Seed completed');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed');
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
