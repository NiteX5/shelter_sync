import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {

    console.log('🌱 Seeding users...');

    const users = [
        {
            id: "1",
            email: "userAdmin@sheltersync.cl",
            username: "Admin",
            passwordHash: await bcrypt.hash("root", 10),
        },

        {
            id: "2",
            email: "userVet@sheltersync.cl",
            username: "Vet",
            passwordHash: await bcrypt.hash("vetpassword", 10),
        },

        {
            id: "3",
            email: "userVolunteer@sheltersync.cl",
            username: "Volunteer",
            passwordHash: await bcrypt.hash("volunteerpassword", 10),
        }
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                id: user.id,
                email: user.email,
                username: user.username,
                passwordHash: user.passwordHash,
            },
        });
    }

    console.log('✅ Users seeded');

    return users;
};