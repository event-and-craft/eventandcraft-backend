import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CmsService } from '../modules/cms/cms.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cmsService = app.get(CmsService);

  console.log('Seeding predefined CMS configuration records...');

  const initialCmsData = [
    {
      key: 'banners',
      description: 'Homepage hero banners config',
      value: JSON.stringify([
        {
          backgroundImageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
          title: 'Unforgettable Events',
          subtitle: 'We craft experiences that last a lifetime',
          description: 'From weddings to corporate galas, we handle everything with precision and creativity.',
        },
        {
          backgroundImageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
          title: 'Exquisite Crafts',
          subtitle: 'Handmade beauty for your special days',
          description: 'Browse our collection of handpicked decorations and crafts to elevate your venue.',
        },
      ]),
    },
    {
      key: 'testimonials',
      description: 'Homepage client testimonials config',
      value: JSON.stringify([
        {
          content: 'EventCraft turned our dream wedding into reality! The coordination was flawless.',
          profileImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          name: 'Sarah Jenkins',
          designation: 'Happy Bride',
        },
        {
          content: 'Excellent corporate event planning. Professional, timely, and creative.',
          profileImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
          name: 'Marcus Brody',
          designation: 'CEO, TechCorp',
        },
      ]),
    },
  ];

  try {
    for (const data of initialCmsData) {
      console.log(`Checking if CMS key "${data.key}" already exists...`);
      try {
        const existing = await cmsService.findByKey(data.key);
        console.log(`CMS key "${data.key}" exists. Updating with seed values...`);
        await cmsService.update(existing.id, JSON.parse(data.value));
      } catch {
        console.log(`CMS key "${data.key}" not found. Inserting...`);
        await cmsService.create({
          key: data.key,
          description: data.description,
          value: JSON.parse(data.value),
        });
      }
    }
    console.log('CMS Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding CMS configurations:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
