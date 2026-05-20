/**
 * VirtualCGO — Database Seed Script
 * ──────────────────────────────────
 * Creates the default system users for all roles.
 * Run from frontend/: npm run db:seed
 *
 * ⚠️ Safe to re-run — uses upsert so existing users are not duplicated.
 */

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const DEFAULT_USERS: SeedUser[] = [
  {
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    password: '123',
    role: 'SUPER_ADMIN',
  },
  {
    name: 'Tech Admin',
    email: 'techadmin@gmail.com',
    password: '123',
    role: 'TECH_ADMIN',
  },
  {
    name: 'Sales Admin',
    email: 'salesadmin@gmail.com',
    password: '123',
    role: 'SALES_ADMIN',
  },
];

async function seed() {
  console.log('\n🌱 VirtualCGO — Database Seed');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const userData of DEFAULT_USERS) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        role: userData.role,
      },
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
      },
    });

    console.log(`✅ ${user.role.padEnd(12)} → ${user.email} (id: ${user.id})`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Seed complete!\n');
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
