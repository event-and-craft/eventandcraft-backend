import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { hashPassword } from '../common/utils/crypto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const args = process.argv.slice(2);
  const email = args[0] || 'admin@mabrooq.com';
  const name = args[1] || 'System Admin';
  const password = args[2] || 'admin123';

  console.log(`Checking if admin user with email "${email}" exists...`);

  try {
    const hashedPassword = hashPassword(password);
    let user = await usersService.findByEmail(email);

    if (user) {
      console.log(
        `User already exists. Updating user to be admin and setting password...`,
      );
      await usersService.update(user.id, {
        isAdmin: true,
        userType: 0, // admin
        authType: 'emailandpassword',
        status: 'active',
        password: hashedPassword,
      });
      console.log(
        `User "${email}" is now a super admin with updated password.`,
      );
    } else {
      console.log(`Creating new super admin user with password...`);
      user = await usersService.create({
        email,
        name,
        isAdmin: true,
        userType: 0, // admin
        authType: 'emailandpassword',
        status: 'active',
        password: hashedPassword,
      });
      console.log(
        `Super admin "${email}" created successfully with ID: ${user.id}`,
      );
    }
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
