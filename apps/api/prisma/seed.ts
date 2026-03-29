import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoCitizens = [
  {
    email: "amina.okoth@civicwallet.app",
    name: "Amina Okoth",
    phone: "+254700000002",
    level: "Beginner",
    pointsTotal: 15,
  },
  {
    email: "brian.kariuki@civicwallet.app",
    name: "Brian Kariuki",
    phone: "+254700000003",
    level: "Beginner",
    pointsTotal: 20,
  },
  {
    email: "charity.mwangi@civicwallet.app",
    name: "Charity Mwangi",
    phone: "+254700000004",
    level: "Explorer",
    pointsTotal: 28,
  },
  {
    email: "daniel.otieno@civicwallet.app",
    name: "Daniel Otieno",
    phone: "+254700000005",
    level: "Explorer",
    pointsTotal: 33,
  },
  {
    email: "edith.njeri@civicwallet.app",
    name: "Edith Njeri",
    phone: "+254700000006",
    level: "Explorer",
    pointsTotal: 37,
  },
  {
    email: "faith.mutheu@civicwallet.app",
    name: "Faith Mutheu",
    phone: "+254700000007",
    level: "Advocate",
    pointsTotal: 44,
  },
  {
    email: "george.barasa@civicwallet.app",
    name: "George Barasa",
    phone: "+254700000008",
    level: "Advocate",
    pointsTotal: 49,
  },
  {
    email: "halima.yusuf@civicwallet.app",
    name: "Halima Yusuf",
    phone: "+254700000009",
    level: "Advocate",
    pointsTotal: 53,
  },
  {
    email: "isaac.wamalwa@civicwallet.app",
    name: "Isaac Wamalwa",
    phone: "+254700000010",
    level: "Advocate",
    pointsTotal: 59,
  },
  {
    email: "joyce.akinyi@civicwallet.app",
    name: "Joyce Akinyi",
    phone: "+254700000011",
    level: "Champion",
    pointsTotal: 66,
  },
  {
    email: "kevin.maina@civicwallet.app",
    name: "Kevin Maina",
    phone: "+254700000012",
    level: "Champion",
    pointsTotal: 72,
  },
  {
    email: "lilian.chebet@civicwallet.app",
    name: "Lilian Chebet",
    phone: "+254700000013",
    level: "Champion",
    pointsTotal: 78,
  },
  {
    email: "moses.kiptoo@civicwallet.app",
    name: "Moses Kiptoo",
    phone: "+254700000014",
    level: "Watchdog",
    pointsTotal: 84,
  },
] as const;

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

  for (const citizen of demoCitizens) {
    await prisma.user.upsert({
      where: { email: citizen.email },
      update: {
        name: citizen.name,
        phone: citizen.phone,
        level: citizen.level,
        pointsTotal: citizen.pointsTotal,
      },
      create: {
        email: citizen.email,
        name: citizen.name,
        phone: citizen.phone,
        passwordHash: userPassword,
        role: Role.USER,
        level: citizen.level,
        pointsTotal: citizen.pointsTotal,
      },
    });
  }

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
      slug: "savings-basics",
      title: "Savings Basics",
      summary: "Build simple savings habits for emergencies and short-term goals.",
      content: "Saving regularly helps households handle emergencies, school needs, rent pressure, and sudden price changes. Even small weekly deposits can build resilience over time when tracked with a clear goal.",
      category: "Savings",
      order: 1,
      quizzes: [
        {
          question: "What is a good first reason to save money?",
          options: ["To avoid every tax", "For emergencies and planned goals", "To stop using banks forever", "Only for luxury spending"],
          answerIndex: 1,
          explanation: "Emergency and goal-based saving is usually the safest starting point.",
        },
      ],
    },
    {
      slug: "budgeting-at-home",
      title: "Budgeting at Home",
      summary: "Track income and expenses with a simple household budget.",
      content: "A household budget lists expected income and planned spending. It helps you see where money goes, identify waste, and make decisions before cash runs short at the end of the month.",
      category: "Budgeting",
      order: 1,
      quizzes: [
        {
          question: "What is the main use of a household budget?",
          options: ["Hide spending", "Plan income and expenses", "Increase debt quickly", "Replace a bank account"],
          answerIndex: 1,
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
      slug: "borrowing-and-debt",
      title: "Borrowing and Debt",
      summary: "Learn when debt can help and when it becomes risky.",
      content: "Borrowing can support emergencies or productive investment, but it becomes dangerous when repayment costs exceed your ability to pay. Interest, penalties, and multiple loans can quickly increase pressure on a household.",
      category: "Credit",
      order: 1,
      quizzes: [
        {
          question: "Which borrowing pattern is riskiest?",
          options: ["Comparing loan terms first", "Borrowing only what you can repay", "Stacking many loans without a payment plan", "Reading interest charges"],
          answerIndex: 2,
        },
      ],
    },
    {
      slug: "mobile-money-safety",
      title: "Mobile Money Safety",
      summary: "Protect your wallet, PIN, and personal information.",
      content: "Mobile money is convenient, but scams exploit urgency and confusion. Never share your PIN, double-check paybill numbers, and confirm messages before sending funds or approving reversals.",
      category: "Digital finance",
      order: 1,
      quizzes: [
        {
          question: "What should you never share with another person?",
          options: ["Your transaction receipt", "Your account nickname", "Your mobile money PIN", "Your network provider"],
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
    {
      slug: "county-revenue-basics",
      title: "County Revenue Basics",
      summary: "Understand common sources of county government revenue.",
      content: "County revenue can come from equitable share transfers, local fees, licenses, parking, markets, and grants. Knowing these sources helps citizens ask better questions about planning and service delivery.",
      category: "Public finance",
      order: 2,
      quizzes: [
        {
          question: "Which is a common source of county revenue?",
          options: ["Household pocket money", "Parking fees and licenses", "Private salary slips", "Classroom exams"],
          answerIndex: 1,
        },
      ],
    },
    {
      slug: "citizen-oversight-101",
      title: "Citizen Oversight 101",
      summary: "Spot stalled projects and report service delivery issues clearly.",
      content: "Citizen oversight means checking whether promised public work is visible on the ground. Useful reports include a location, a short description, what was expected, and what you actually observed.",
      category: "Civic action",
      order: 1,
      quizzes: [
        {
          question: "What makes a public issue report more useful?",
          options: ["Vague rumors only", "A clear location and observed facts", "An anonymous insult", "No project details"],
          answerIndex: 1,
        },
      ],
    },
    {
      slug: "understanding-procurement",
      title: "Understanding Procurement",
      summary: "Get familiar with how public goods and services are purchased.",
      content: "Procurement is the process governments use to buy goods, works, and services. Transparent procurement reduces waste by documenting what was needed, who supplied it, and how much it cost.",
      category: "Governance",
      order: 1,
      quizzes: [
        {
          question: "Why does transparent procurement matter?",
          options: ["It hides costs", "It makes public spending easier to check", "It removes all taxes", "It stops every delay instantly"],
          answerIndex: 1,
        },
      ],
    },
    {
      slug: "youth-entrepreneurship",
      title: "Youth Entrepreneurship",
      summary: "Think through basic money choices for small side businesses.",
      content: "A small business needs simple record keeping, a clear customer problem, and separation between business cash and personal cash. Profit is easier to understand when daily sales and costs are written down consistently.",
      category: "Enterprise",
      order: 1,
      quizzes: [
        {
          question: "What habit helps a small business owner track profit better?",
          options: ["Mixing business and personal money", "Recording sales and costs regularly", "Ignoring stock levels", "Avoiding all planning"],
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
