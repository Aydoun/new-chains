import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding...`);

  // Seed Users
  console.log("Seeding Users...");
  const usersData = Array.from({ length: 100 }).map(() => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    avatarUrl: faker.image.avatar(),
  }));
  await prisma.user.createMany({ data: usersData });

  const users = await prisma.user.findMany();

  // Seed Collections
  console.log("Seeding Collections...");
  const collectionsData = users.flatMap((user) =>
    Array.from({ length: 5 }).map(() => ({
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      tags: faker.helpers.arrayElements(["art", "music", "tech", "science"], 3),
      userId: user.id,
      url: faker.image.avatar(),
      visibility: faker.helpers.arrayElement([
        "PUBLIC",
        "PRIVATE",
        "FRIENDS_ONLY",
      ]),
      popularity: faker.number.int({ min: 0, max: 10 }),
      views: faker.number.int({ min: 0, max: 1000 }),
      likes: faker.number.int({ min: 0, max: 100 }),
    }))
  );
  await prisma.collection.createMany({ data: collectionsData });

  const collections = await prisma.collection.findMany();

  // Seed Media
  console.log("Seeding Media...");
  const mediaData = collections.flatMap((collection) =>
    Array.from({ length: 10 }).map(() => ({
      type: faker.helpers.arrayElement([
        "TEXT",
        "IMAGE",
        "VIDEO",
        "AUDIO",
        "DOCUMENT",
      ]),
      url: faker.internet.url(),
      description: faker.lorem.sentence(),
      thumbnailUrl: faker.image.avatar(),
      altText: faker.lorem.words(3),
      reportedCount: faker.number.int({ min: 0, max: 10 }),
      views: faker.number.int({ min: 0, max: 1000 }),
      likes: faker.number.int({ min: 0, max: 100 }),
    }))
  );
  await prisma.media.createMany({ data: mediaData });

  const mediaItems = await prisma.media.findMany();

  // Seed Likes
  console.log("Seeding Likes...");
  const likesData = users.flatMap((user) =>
    Array.from({ length: 20 }).map(() => ({
      userId: user.id,
      mediaId: faker.helpers.arrayElement(mediaItems).id,
    }))
  );
  await prisma.like.createMany({ data: likesData });

  // Seed Comments
  console.log("Seeding Comments...");
  const commentsData = users.flatMap((user) =>
    Array.from({ length: 20 }).map(() => ({
      content: faker.lorem.sentence(),
      userId: user.id,
      mediaId: faker.helpers.arrayElement(mediaItems).id,
    }))
  );
  await prisma.comment.createMany({ data: commentsData });

  // Seed Reports
  console.log("Seeding Reports...");
  const reportsData = Array.from({ length: 50 }).map(() => ({
    reporterId: faker.helpers.arrayElement(users).id,
    mediaId: faker.helpers.arrayElement(mediaItems).id,
    reason: faker.helpers.arrayElement([
      "SPAM",
      "INAPPROPRIATE",
      "COPYRIGHT",
      "OTHER",
    ]),
    status: faker.helpers.arrayElement(["PENDING", "REVIEWED", "ACTION_TAKEN"]),
    resolvedAt: faker.date.past(),
  }));
  await prisma.report.createMany({ data: reportsData });

  console.log(`Seeding completed.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
