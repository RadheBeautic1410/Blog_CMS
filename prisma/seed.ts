import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL environment variable is not set!\n" +
    "Please create a .env file in the root directory with:\n" +
    "DATABASE_URL=\"mongodb://localhost:27017/blogdb\"\n" +
    "or for MongoDB Atlas:\n" +
    "DATABASE_URL=\"mongodb+srv://username:password@cluster.mongodb.net/blogdb\""
  );
  process.exit(1);
}

// Prisma v6 supports MongoDB natively without adapters
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bloghub.com" },
    update: {},
    create: {
      email: "admin@bloghub.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
    },
  });

  console.log("✅ Created/Updated admin user:", admin.email);
  console.log("📝 Default password: admin123");
  console.log("⚠️  Please change the default password after first login!");

  // Create popular categories
  const categories = [
    { name: "Technology", slug: "technology" },
    { name: "Business", slug: "business" },
    { name: "Programming", slug: "programming" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Marketing", slug: "marketing" },
    { name: "Design", slug: "design" },
    { name: "Health", slug: "health" },
    { name: "Education", slug: "education" },
    { name: "Finance", slug: "finance" },
    { name: "Travel", slug: "travel" },
    { name: "Food", slug: "food" },
    { name: "Sports", slug: "sports" },
    { name: "Entertainment", slug: "entertainment" },
    { name: "Science", slug: "science" },
    { name: "News", slug: "news" },
  ];

  console.log("\n📂 Creating categories...");
  let createdCount = 0;
  let skippedCount = 0;

  for (const category of categories) {
    try {
      const result = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          // Keep existing data, just ensure it exists
        },
        create: {
          name: category.name,
          slug: category.slug,
          count: 0,
        },
      });

      // Check if it was just created (by comparing if it has the default count)
      const wasCreated = result.count === 0 && result.name === category.name;
      if (wasCreated) {
        createdCount++;
        console.log(`  ✓ Created: ${category.name}`);
      } else {
        skippedCount++;
        console.log(`  ⊙ Exists: ${category.name}`);
      }
    } catch (error: any) {
      console.error(`  ✗ Error with category ${category.name}:`, error.message);
    }
  }

  console.log(`\n✅ Created ${createdCount} new categories`);
  if (skippedCount > 0) {
    console.log(`📝 Skipped ${skippedCount} existing categories`);
  }

  // Create sample authors
  console.log("\n👤 Creating authors...");
  const authorsData = [
    { name: "John Doe", email: "john.doe@bloghub.com" },
    { name: "Jane Smith", email: "jane.smith@bloghub.com" },
    { name: "Mike Johnson", email: "mike.johnson@bloghub.com" },
    { name: "Sarah Williams", email: "sarah.williams@bloghub.com" },
    { name: "David Brown", email: "david.brown@bloghub.com" },
    { name: "Emily Davis", email: "emily.davis@bloghub.com" },
  ];

  const createdAuthors: { id: string; name: string }[] = [];
  for (const authorData of authorsData) {
    try {
      const author = await prisma.author.upsert({
        where: { email: authorData.email },
        update: {},
        create: {
          name: authorData.name,
          email: authorData.email,
          bio: `Experienced writer and content creator specializing in technology and business topics.`,
        },
      });
      createdAuthors.push({ id: author.id, name: author.name });
      console.log(`  ✓ Created/Updated: ${author.name}`);
    } catch (error: any) {
      console.error(`  ✗ Error creating author ${authorData.name}:`, error.message);
    }
  }

  // Get all categories for reference
  const allCategories = await prisma.category.findMany();
  const categoryMap = new Map(allCategories.map((cat) => [cat.name, cat]));

  // Create sample blog posts
  console.log("\n📝 Creating blog posts...");
  const blogsData = [
    {
      title: "Getting Started with Next.js 14: A Complete Guide",
      slug: "getting-started-with-nextjs-14-complete-guide",
      excerpt: "Learn how to build modern web applications with Next.js 14, including App Router, Server Components, and best practices.",
      content: `<h2>Introduction</h2>
<p>Next.js 14 brings exciting new features and improvements that make building React applications even more powerful. In this comprehensive guide, we'll explore the key features and how to get started.</p>

<h2>What's New in Next.js 14</h2>
<p>The latest version introduces several groundbreaking features:</p>
<ul>
  <li><strong>App Router:</strong> A new routing system that provides better performance and developer experience</li>
  <li><strong>Server Components:</strong> Components that render on the server, reducing client-side JavaScript</li>
  <li><strong>Improved Performance:</strong> Better optimization and faster page loads</li>
  <li><strong>Enhanced Developer Experience:</strong> Better tooling and debugging capabilities</li>
</ul>

<h2>Getting Started</h2>
<p>To create a new Next.js 14 project, use the following command:</p>
<pre><code>npx create-next-app@latest my-app</code></pre>

<p>This will set up a new Next.js project with all the latest features and best practices.</p>

<h2>Conclusion</h2>
<p>Next.js 14 is a powerful framework that makes building modern web applications easier and more efficient. Start exploring today!</p>`,
      category: "Programming",
      author: "John Doe",
      tags: ["nextjs", "react", "web-development", "tutorial"],
      status: "published",
      featured: true,
    },
    {
      title: "The Future of AI in Web Development",
      slug: "future-of-ai-in-web-development",
      excerpt: "Exploring how artificial intelligence is transforming the way we build and interact with web applications.",
      content: `<h2>Introduction</h2>
<p>Artificial Intelligence is revolutionizing web development in ways we never imagined. From code generation to user experience optimization, AI is becoming an integral part of the development process.</p>

<h2>AI-Powered Development Tools</h2>
<p>Modern AI tools are helping developers:</p>
<ul>
  <li>Generate code faster with AI assistants</li>
  <li>Debug and optimize applications automatically</li>
  <li>Create better user experiences through personalization</li>
  <li>Improve accessibility and performance</li>
</ul>

<h2>The Impact on Developers</h2>
<p>While AI is automating many tasks, it's also creating new opportunities for developers to focus on creative problem-solving and strategic thinking.</p>

<h2>Conclusion</h2>
<p>The future of web development is AI-enhanced, not AI-replaced. Embrace these tools to become a more efficient and effective developer.</p>`,
      category: "Technology",
      author: "Jane Smith",
      tags: ["ai", "machine-learning", "web-development", "future"],
      status: "published",
      featured: true,
    },
    {
      title: "10 Essential Business Strategies for 2024",
      slug: "10-essential-business-strategies-2024",
      excerpt: "Discover the key strategies that successful businesses are using to thrive in today's competitive market.",
      content: `<h2>Introduction</h2>
<p>In today's rapidly changing business landscape, staying ahead requires strategic thinking and adaptability. Here are 10 essential strategies for success in 2024.</p>

<h2>1. Digital Transformation</h2>
<p>Embrace technology to streamline operations and improve customer experiences.</p>

<h2>2. Customer-Centric Approach</h2>
<p>Put your customers at the center of every decision you make.</p>

<h2>3. Data-Driven Decisions</h2>
<p>Use analytics and data to guide your business strategy.</p>

<h2>4. Sustainability Focus</h2>
<p>Implement sustainable practices that benefit both your business and the environment.</p>

<h2>5. Remote Work Optimization</h2>
<p>Create effective remote work policies and tools for your team.</p>

<h2>6. Innovation Culture</h2>
<p>Foster a culture that encourages creativity and innovation.</p>

<h2>7. Strategic Partnerships</h2>
<p>Build strong partnerships that complement your business strengths.</p>

<h2>8. Employee Development</h2>
<p>Invest in your team's growth and development.</p>

<h2>9. Financial Planning</h2>
<p>Maintain strong financial health with careful planning and monitoring.</p>

<h2>10. Agility and Flexibility</h2>
<p>Stay flexible to adapt quickly to market changes.</p>

<h2>Conclusion</h2>
<p>Implementing these strategies will help your business thrive in 2024 and beyond.</p>`,
      category: "Business",
      author: "Mike Johnson",
      tags: ["business", "strategy", "leadership", "growth"],
      status: "published",
      featured: true,
    },
    {
      title: "Mastering TypeScript: Advanced Patterns and Techniques",
      slug: "mastering-typescript-advanced-patterns",
      excerpt: "Dive deep into advanced TypeScript patterns that will make your code more maintainable and type-safe.",
      content: `<h2>Introduction</h2>
<p>TypeScript has become the standard for building large-scale JavaScript applications. Let's explore advanced patterns that will elevate your TypeScript skills.</p>

<h2>Advanced Type Patterns</h2>
<p>Learn about:</p>
<ul>
  <li>Conditional types and their applications</li>
  <li>Mapped types for transforming object structures</li>
  <li>Template literal types for string manipulation</li>
  <li>Utility types and when to use them</li>
</ul>

<h2>Design Patterns in TypeScript</h2>
<p>Explore how classic design patterns work in TypeScript:</p>
<ul>
  <li>Factory Pattern</li>
  <li>Singleton Pattern</li>
  <li>Observer Pattern</li>
  <li>Strategy Pattern</li>
</ul>

<h2>Best Practices</h2>
<p>Key practices for writing maintainable TypeScript code:</p>
<ul>
  <li>Proper type definitions</li>
  <li>Effective use of generics</li>
  <li>Error handling strategies</li>
  <li>Testing TypeScript code</li>
</ul>

<h2>Conclusion</h2>
<p>Mastering these advanced TypeScript patterns will make you a more effective developer and help you build better applications.</p>`,
      category: "Programming",
      author: "Sarah Williams",
      tags: ["typescript", "programming", "web-development", "advanced"],
      status: "published",
      featured: false,
    },
    {
      title: "Digital Marketing Trends You Can't Ignore",
      slug: "digital-marketing-trends-2024",
      excerpt: "Stay ahead of the curve with these emerging digital marketing trends that are shaping the industry.",
      content: `<h2>Introduction</h2>
<p>The digital marketing landscape is constantly evolving. Here are the trends you need to know about in 2024.</p>

<h2>1. AI-Powered Marketing</h2>
<p>Artificial intelligence is revolutionizing how we create and optimize marketing campaigns.</p>

<h2>2. Video Content Dominance</h2>
<p>Video continues to be the most engaging form of content across all platforms.</p>

<h2>3. Personalization at Scale</h2>
<p>Advanced tools are making it easier to personalize marketing messages for individual customers.</p>

<h2>4. Voice Search Optimization</h2>
<p>As voice assistants become more popular, optimizing for voice search is crucial.</p>

<h2>5. Social Commerce</h2>
<p>Selling directly through social media platforms is becoming the norm.</p>

<h2>6. Sustainability Marketing</h2>
<p>Consumers are increasingly choosing brands that align with their values.</p>

<h2>Conclusion</h2>
<p>Staying on top of these trends will help you create more effective marketing strategies.</p>`,
      category: "Marketing",
      author: "David Brown",
      tags: ["marketing", "digital-marketing", "trends", "strategy"],
      status: "published",
      featured: false,
    },
    {
      title: "Building a Healthy Work-Life Balance",
      slug: "building-healthy-work-life-balance",
      excerpt: "Practical tips and strategies for maintaining productivity while ensuring your personal well-being.",
      content: `<h2>Introduction</h2>
<p>Maintaining a healthy work-life balance is essential for long-term success and happiness. Here's how to achieve it.</p>

<h2>Setting Boundaries</h2>
<p>Learn to set clear boundaries between work and personal time.</p>

<h2>Time Management</h2>
<p>Effective time management techniques that help you accomplish more in less time.</p>

<h2>Prioritizing Self-Care</h2>
<p>Self-care isn't selfish—it's necessary for sustained productivity and well-being.</p>

<h2>Learning to Say No</h2>
<p>Understanding when and how to decline requests that don't align with your priorities.</p>

<h2>Creating Routines</h2>
<p>Establishing routines that support both your professional and personal goals.</p>

<h2>Conclusion</h2>
<p>A healthy work-life balance is achievable with the right strategies and mindset.</p>`,
      category: "Lifestyle",
      author: "Emily Davis",
      tags: ["lifestyle", "productivity", "wellness", "work-life-balance"],
      status: "published",
      featured: false,
    },
  ];

  let blogsCreated = 0;
  for (const blogData of blogsData) {
    try {
      // Find the author
      const author = createdAuthors.find((a) => a.name === blogData.author);
      if (!author) {
        console.log(`  ⚠ Skipping blog "${blogData.title}" - author not found`);
        continue;
      }

      // Find the category
      const category = categoryMap.get(blogData.category);
      if (!category) {
        console.log(`  ⚠ Skipping blog "${blogData.title}" - category not found`);
        continue;
      }

      // Check if blog already exists
      const existingBlog = await prisma.blog.findUnique({
        where: { slug: blogData.slug },
      });

      if (existingBlog) {
        console.log(`  ⊙ Exists: ${blogData.title}`);
        continue;
      }

      // Create the blog
      await prisma.blog.create({
        data: {
          title: blogData.title,
          slug: blogData.slug,
          excerpt: blogData.excerpt,
          content: blogData.content,
          author: blogData.author,
          authorId: author.id,
          category: blogData.category,
          categoryId: category.id,
          image: "", // Empty - user will upload images later
          tags: blogData.tags,
          status: blogData.status,
          featured: blogData.featured,
          metaTitle: blogData.title,
          metaDescription: blogData.excerpt,
          date: new Date(),
        },
      });

      blogsCreated++;
      console.log(`  ✓ Created: ${blogData.title}`);
    } catch (error: any) {
      console.error(`  ✗ Error creating blog "${blogData.title}":`, error.message);
    }
  }

  console.log(`\n✅ Created ${blogsCreated} new blog posts`);
  console.log("✨ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
