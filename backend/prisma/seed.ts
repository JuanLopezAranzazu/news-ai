import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    "Tecnología",
    "Deportes",
    "Economía",
    "Política",
    "Entretenimiento",
    "Salud",
    "Ciencia",
    "Mundo",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Example source config. Adjust selectors to match the real site's markup.
  await prisma.source.upsert({
    where: { url: "https://example-news-site.com" },
    update: {},
    create: {
      name: "Example News",
      url: "https://example-news-site.com",
      listSelector: "article a.headline",
      titleSelector: "h1",
      contentSelector: "article p",
      imageSelector: "article img",
      authorSelector: ".author-name",
      dateSelector: "time",
      active: true,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
