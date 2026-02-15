export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  featured?: boolean;
}

export const blogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 14: A Complete Guide",
    excerpt: "Learn how to build modern web applications with Next.js 14, including App Router, Server Components, and best practices.",
    content: "Full content here...",
    author: "John Doe",
    date: "2024-01-15",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    excerpt: "Exploring how artificial intelligence is transforming the way we build and interact with web applications.",
    content: "Full content here...",
    author: "Jane Smith",
    date: "2024-01-12",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    id: "3",
    title: "10 Essential Business Strategies for 2024",
    excerpt: "Discover the key strategies that successful businesses are using to thrive in today's competitive market.",
    content: "Full content here...",
    author: "Mike Johnson",
    date: "2024-01-10",
    category: "Business",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    id: "4",
    title: "Mastering TypeScript: Advanced Patterns and Techniques",
    excerpt: "Dive deep into advanced TypeScript patterns that will make your code more maintainable and type-safe.",
    content: "Full content here...",
    author: "Sarah Williams",
    date: "2024-01-08",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: "5",
    title: "Digital Marketing Trends You Can't Ignore",
    excerpt: "Stay ahead of the curve with these emerging digital marketing trends that are shaping the industry.",
    content: "Full content here...",
    author: "David Brown",
    date: "2024-01-05",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: "6",
    title: "Building a Healthy Work-Life Balance",
    excerpt: "Practical tips and strategies for maintaining productivity while ensuring your personal well-being.",
    content: "Full content here...",
    author: "Emily Davis",
    date: "2024-01-03",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: "7",
    title: "React Server Components: What You Need to Know",
    excerpt: "Understanding React Server Components and how they're revolutionizing the way we build React applications.",
    content: "Full content here...",
    author: "Chris Anderson",
    date: "2024-01-01",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: "8",
    title: "Cloud Computing: A Beginner's Guide",
    excerpt: "Everything you need to know about cloud computing, from basic concepts to choosing the right provider.",
    content: "Full content here...",
    author: "Alex Martinez",
    date: "2023-12-28",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    featured: false,
  },
  {
    id: "9",
    title: "Startup Funding: A Complete Guide",
    excerpt: "Navigate the complex world of startup funding with this comprehensive guide to investors, valuations, and more.",
    content: "Full content here...",
    author: "Lisa Chen",
    date: "2023-12-25",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop",
    featured: false,
  },
];

export const categories = [
  { name: "Technology", slug: "technology", count: 12 },
  { name: "Business", slug: "business", count: 8 },
  { name: "Programming", slug: "programming", count: 15 },
  { name: "Lifestyle", slug: "lifestyle", count: 6 },
  { name: "Marketing", slug: "marketing", count: 9 },
];
