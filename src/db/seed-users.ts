import bcrypt from 'bcryptjs';
import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

async function seedUsers() {
  console.log('🌱 Seeding users...\n');

  const defaultUsers = [
    {
      username: 'admin',
      password: 'coffeemarket123',
      role: 'superuser' as const,
      name: 'Super Admin',
    },
    {
      username: 'staff',
      password: 'staff123',
      role: 'user' as const,
      name: 'Staff View Only',
    },
  ];

  for (const user of defaultUsers) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, user.username))
      .limit(1);

    const hashedPassword = await bcrypt.hash(user.password, 12);

    if (existing.length > 0) {
      await db
        .update(users)
        .set({ password: hashedPassword, role: user.role, name: user.name })
        .where(eq(users.username, user.username));
      console.log(`  ✅ Updated: ${user.username} (${user.role})`);
    } else {
      await db.insert(users).values({
        username: user.username,
        password: hashedPassword,
        role: user.role,
        name: user.name,
      });
      console.log(`  ✅ Created: ${user.username} (${user.role})`);
    }
  }

  console.log('\n✨ User seeding complete!');
  console.log('   superuser: admin / coffeemarket123');
  console.log('   view-only: staff / staff123');
}

seedUsers();
