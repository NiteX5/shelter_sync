import { PrismaClient } from '@prisma/client';

export async function seedPermissions(prisma: PrismaClient) {
  const permissions = [
    { id: 1, slug: 'animals.read', module: 'animals' },
    { id: 2, slug: 'animals.write', module: 'animals' },
    { id: 5, slug: 'animal.enter', module: 'animals' },
    { id: 11, slug: 'animal.adopt', module: 'animals' },
    { id: 13, slug: 'animal.edit', module: 'animals' },

    { id: 3, slug: 'medical.read', module: 'medical' },
    { id: 4, slug: 'medical.write', module: 'medical' },
    { id: 12, slug: 'medical.edit', module: 'medical' },

    { id: 6, slug: 'adoptions.read', module: 'adoptions' },
    { id: 7, slug: 'adoptions.write', module: 'adoptions' },
    { id: 8, slug: 'adoptions.approve', module: 'adoptions' },

    { id: 9, slug: 'users.read', module: 'users' },
    { id: 10, slug: 'users.manage', module: 'users' },
  ];

  for (const permission of permissions){
        await prisma.permission.upsert({
            where: { id: permission.id, slug: permission.slug },
            update: {},
            create: permission,
        });
  }

    console.log('✅ Permissions seeded');
}
