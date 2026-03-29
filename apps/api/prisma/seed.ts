import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User12345!", 10);

  await prisma.user.upsert({
    where: { email: "admin@civicwallet.app" },
    update: {},
    create: {
      email: "admin@civicwallet.app",
      name: "Civic Admin",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      level: "Watchdog",
      pointsTotal: 120,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@civicwallet.app" },
    update: {},
    create: {
      email: "user@civicwallet.app",
      name: "Demo Citizen",
      passwordHash: userPassword,
      role: Role.USER,
      level: "Advocate",
      pointsTotal: 40,
      phone: "+254700000001",
    },
  });

  const lessons = [
    {
      slug: "taxes-101",
      title: "Taxes 101",
      summary: "Learn where taxes come from and why they matter.",
      content: "Taxes fund public services like healthcare, roads, schools, and public safety. Direct taxes come from income and profits, while indirect taxes come from purchases like VAT.",
      category: "Taxes",
      order: 1,
      quizzes: [
        {
          question: "Which of these is an example of an indirect tax?",
          options: ["Income tax", "VAT", "Corporate tax", "Property tax"],
          answerIndex: 1,
          explanation: "VAT is charged on goods and services and is considered an indirect tax.",
        },
      ],
    },
    {
      slug: "inflation-basics",
      title: "Inflation Basics",
      summary: "Understand how prices rise and affect daily life.",
      content: "Inflation measures how the cost of goods and services changes over time. When inflation is high, money buys fewer goods than before.",
      category: "Inflation",
      order: 1,
      quizzes: [
        {
          question: "What happens to purchasing power during high inflation?",
          options: ["It increases", "It stays the same", "It decreases", "It disappears immediately"],
          answerIndex: 2,
        },
      ],
    },
    {
      slug: "public-budgeting",
      title: "Public Budgeting",
      summary: "See how budgets plan spending across sectors.",
      content: "A public budget estimates revenue and allocates spending across health, education, infrastructure, security, and other priorities.",
      category: "Public finance",
      order: 1,
      quizzes: [
        {
          question: "What is the main purpose of a public budget?",
          options: ["Track personal debt", "Plan government revenue and spending", "Issue bank loans", "Set private salaries"],
          answerIndex: 1,
        },
      ],
    },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: {
        title: lesson.title,
        summary: lesson.summary,
        content: lesson.content,
        category: lesson.category,
        order: lesson.order,
      },
      create: {
        title: lesson.title,
        slug: lesson.slug,
        summary: lesson.summary,
        content: lesson.content,
        category: lesson.category,
        order: lesson.order,
        quizzes: {
          create: lesson.quizzes.map((quiz) => ({
            ...quiz,
            options: quiz.options,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
