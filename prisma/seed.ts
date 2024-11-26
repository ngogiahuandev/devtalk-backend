/* eslint-disable prettier/prettier */
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      username: 'dev_master',
      email: 'devmaster@example.com',
      password: 'hashedpassword1', // Replace with actual hashed password
      bio: 'I am the master of development!',
      avatarUrl: 'https://example.com/avatar1.png',
      role: Role.ADMIN,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'tech_writer',
      email: 'techwriter@example.com',
      password: 'hashedpassword2',
      bio: 'Sharing my technical insights with the world.',
      avatarUrl: 'https://example.com/avatar2.png',
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'code_ninja',
      email: 'codeninja@example.com',
      password: 'hashedpassword3',
      bio: 'Passionate about clean and efficient code.',
      avatarUrl: 'https://example.com/avatar3.png',
      role: Role.USER,
    },
  });

  // Create Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Introduction to NestJS',
      body: 'NestJS is a progressive framework for building efficient, reliable, and scalable server-side applications.',
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'GraphQL with Prisma',
      body: 'Learn how to set up Prisma with GraphQL for seamless database access.',
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Mastering TypeScript',
      body: 'Tips and tricks to become a TypeScript pro!',
      authorId: user3.id,
    },
  });

  // Create Tags
  const tag1 = await prisma.tag.create({ data: { name: 'NestJS' } });
  const tag2 = await prisma.tag.create({ data: { name: 'GraphQL' } });
  const tag3 = await prisma.tag.create({ data: { name: 'TypeScript' } });

  // Link Tags to Posts
  await prisma.post.update({
    where: { id: post1.id },
    data: { tags: { connect: [{ id: tag1.id }] } },
  });

  await prisma.post.update({
    where: { id: post2.id },
    data: { tags: { connect: [{ id: tag2.id }] } },
  });

  await prisma.post.update({
    where: { id: post3.id },
    data: { tags: { connect: [{ id: tag3.id }] } },
  });

  // Create Comments
  await prisma.comment.create({
    data: {
      content: 'Great post on NestJS!',
      postId: post1.id,
      authorId: user2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Very helpful guide, thanks!',
      postId: post2.id,
      authorId: user3.id,
    },
  });

  // Create Likes
  await prisma.like.create({
    data: {
      postId: post1.id,
      userId: user3.id,
    },
  });

  await prisma.like.create({
    data: {
      postId: post2.id,
      userId: user1.id,
    },
  });

  // Create Bookmarks
  await prisma.bookmark.create({
    data: {
      postId: post3.id,
      userId: user2.id,
    },
  });

  await prisma.bookmark.create({
    data: {
      postId: post1.id,
      userId: user3.id,
    },
  });

  // Create Notifications
  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: 'COMMENT',
      message: 'Your post received a new comment!',
    },
  });

  await prisma.notification.create({
    data: {
      userId: user2.id,
      type: 'LIKE',
      message: 'Your post received a new like!',
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
