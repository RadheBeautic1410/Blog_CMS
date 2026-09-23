import "dotenv/config";
import { prisma } from "./lib/prisma";

/**
 * Seeds the Orbit queue with evergreen, high-search-volume topics.
 * Temporary helper - safe to delete once it has run.
 *
 * A topic's category is only set when a category with that name actually
 * exists; otherwise it is left null and Orbit picks one at write time.
 */
const TOPICS: { title: string; category: string; keywords: string[] }[] = [
  {
    title: "AI Tools That Actually Save You Time at Work",
    category: "Technology",
    keywords: ["ai tools", "productivity", "work automation"],
  },
  {
    title: "How to Spot a Phishing Email Before You Click",
    category: "Technology",
    keywords: ["phishing", "online safety", "email security"],
  },
  {
    title: "Git Commands Every Developer Uses Every Day",
    category: "Programming",
    keywords: ["git commands", "version control", "developer workflow"],
  },
  {
    title: "REST vs GraphQL: Which One Should You Pick?",
    category: "Programming",
    keywords: ["rest api", "graphql", "api design"],
  },
  {
    title: "How to Write a Business Plan Investors Actually Read",
    category: "Business",
    keywords: ["business plan", "startup", "investor pitch"],
  },
  {
    title: "Passive Income Ideas That Actually Work",
    category: "Business",
    keywords: ["passive income", "side hustle", "online income"],
  },
  {
    title: "How to Build an Emergency Fund on a Small Salary",
    category: "Finance",
    keywords: ["emergency fund", "saving money", "personal finance"],
  },
  {
    title: "SIP vs Lump Sum: Which Mutual Fund Strategy Wins?",
    category: "Finance",
    keywords: ["sip", "mutual funds", "investing"],
  },
  {
    title: "How Much Water Do You Really Need in a Day?",
    category: "Health",
    keywords: ["hydration", "daily water intake", "health myths"],
  },
  {
    title: "Simple Desk Stretches That Ease Back Pain",
    category: "Health",
    keywords: ["back pain", "desk job", "stretches"],
  },
  {
    title: "Morning Routines That Take Under 20 Minutes",
    category: "Lifestyle",
    keywords: ["morning routine", "habits", "productivity"],
  },
  {
    title: "Budget Travel Tips for First-Time Flyers",
    category: "Travel",
    keywords: ["budget travel", "flight tips", "first time flyer"],
  },
  {
    title: "High-Protein Vegetarian Meals You Can Cook in 20 Minutes",
    category: "Food",
    keywords: ["vegetarian protein", "quick meals", "healthy recipes"],
  },
  {
    title: "SEO Basics Every Small Business Should Know",
    category: "Marketing",
    keywords: ["seo basics", "small business marketing", "google ranking"],
  },
  {
    title: "How to Learn a New Skill Faster: Methods That Work",
    category: "Education",
    keywords: ["learning techniques", "study tips", "skill building"],
  },
  {
    title: "Why the Sky Changes Colour at Sunset",
    category: "Science",
    keywords: ["sunset", "light scattering", "science explained"],
  },
];

async function main() {
  const categories = await prisma.category.findMany({ select: { name: true } });
  const known = new Set(categories.map((c) => c.name.toLowerCase()));
  console.log(`categories in DB: ${categories.map((c) => c.name).join(", ")}`);

  const [existingTopics, existingBlogs] = await Promise.all([
    prisma.orbitTopic.findMany({ select: { title: true } }),
    prisma.blog.findMany({ select: { title: true } }),
  ]);
  const taken = new Set(
    [...existingTopics, ...existingBlogs].map((r) => r.title.trim().toLowerCase())
  );

  const fresh = TOPICS.filter((t) => !taken.has(t.title.trim().toLowerCase()));
  const skipped = TOPICS.length - fresh.length;

  if (fresh.length === 0) {
    console.log("nothing to add - every topic is already queued or published");
    return;
  }

  const result = await prisma.orbitTopic.createMany({
    data: fresh.map((t) => ({
      title: t.title,
      keywords: t.keywords,
      category: known.has(t.category.toLowerCase()) ? t.category : null,
      status: "pending",
      source: "manual",
    })),
  });

  console.log(`added ${result.count} topics (skipped ${skipped} duplicates)`);
  for (const t of fresh) {
    const mapped = known.has(t.category.toLowerCase()) ? t.category : "auto-pick";
    console.log(`  [${mapped}] ${t.title}`);
  }

  const pending = await prisma.orbitTopic.count({ where: { status: "pending" } });
  console.log(`queue now holds ${pending} pending topics`);
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message.split("\n").slice(0, 3).join(" ").slice(0, 300));
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
