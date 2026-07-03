import type { BlogPost, Product } from "@/lib/pi-types";

export const navigationLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/pi-lab", label: "Pi Lab" },
];

export const storeStats = [
  { value: "80%", label: "storefront-first experience" },
  { value: "Test-Pi", label: "checkout mode for current rollout" },
  { value: "3 lanes", label: "shop, blog, and Pi commerce" },
];

export const brandPillars = [
  {
    title: "Pi-native commerce",
    description:
      "Shoppers can sign in with Pi, browse your catalog, and move toward native Pi payments without leaving the Pi ecosystem.",
  },
  {
    title: "Mushroom expertise",
    description:
      "Editorial content gives the brand authority, while also creating organic reasons for people to return beyond one-off purchases.",
  },
  {
    title: "Merchant-ready structure",
    description:
      "The layout is intentionally weighted toward products, bundles, and conversion flows while preserving room for storytelling.",
  },
];

export const piSetupSteps = [
  "Register Mushroom.Pi in the Pi Developer Portal from the Pi Browser.",
  "Select Pi Testnet first, because the network choice is fixed per app.",
  "Set the app URL to your hosted site and the development URL to your local server.",
  "Create or connect the app wallet, then copy the Server API Key into your environment variables.",
  "Open the site in Pi Browser or Pi Sandbox to test sign-in and payment flows safely.",
];

export const products: Product[] = [
  {
    id: "lions-mane-focus-tonic",
    slug: "lions-mane-focus-tonic",
    name: "Lion's Mane Focus Tonic",
    tagline: "Daily clarity blend for deep work and calm momentum.",
    description:
      "A hero product positioned for builders, writers, and Pi-native workers who want a functional mushroom ritual.",
    category: "Functional wellness",
    format: "30 sachets",
    pricePi: 0.75,
    badge: "Top seller",
    accent: "linear-gradient(135deg, #f1c857, #915228)",
  },
  {
    id: "reishi-night-drops",
    slug: "reishi-night-drops",
    name: "Reishi Night Drops",
    tagline: "Evening reset formula with a slow, earthy profile.",
    description:
      "Designed as a calmer second product line for bundles, subscriptions, and bedtime routines.",
    category: "Wind-down support",
    format: "50 ml tincture",
    pricePi: 0.58,
    badge: "Bundle pick",
    accent: "linear-gradient(135deg, #6d3b2a, #c38d58)",
  },
  {
    id: "cordyceps-trail-pack",
    slug: "cordyceps-trail-pack",
    name: "Cordyceps Trail Pack",
    tagline: "Portable boost mix for movement days and lighter stamina.",
    description:
      "A more active, grab-and-go offer that makes the storefront feel broader than a single wellness SKU.",
    category: "Active energy",
    format: "12 stick packs",
    pricePi: 0.49,
    badge: "Starter friendly",
    accent: "linear-gradient(135deg, #cc7b33, #4a6d48)",
  },
  {
    id: "shiitake-kitchen-box",
    slug: "shiitake-kitchen-box",
    name: "Shiitake Kitchen Box",
    tagline: "A culinary set for cooks who want flavor, texture, and story.",
    description:
      "This anchors the edible side of the catalog and broadens the brand beyond supplements alone.",
    category: "Culinary mushrooms",
    format: "Recipe box",
    pricePi: 0.67,
    badge: "Seasonal edit",
    accent: "linear-gradient(135deg, #ad6d3f, #d9b37a)",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "why-lions-mane-is-a-hero-product",
    title: "Why Lion's Mane makes sense as the hero product for Mushroom.Pi",
    excerpt:
      "A practical look at why focus-oriented mushrooms fit both e-commerce positioning and Pi-native utility branding.",
    category: "Brand strategy",
    publishedAt: "July 2026",
    readTime: "5 min read",
    coverNote: "Hero SKU strategy",
    body: [
      "Lion's Mane sits at the overlap of curiosity, utility, and repeat purchase behavior. That makes it a strong anchor for a Pi-powered storefront because shoppers immediately understand why it exists and how it fits into a daily ritual.",
      "For Mushroom.Pi, a hero SKU does more than drive revenue. It creates a clearer onboarding path for first-time Pi users who may be testing the checkout flow and do not want to choose from too many unfamiliar products.",
      "From a content perspective, Lion's Mane also gives the blog a natural editorial spine: focus routines, maker workflows, dosage stories, stacking habits, and beginner education can all connect back to one product family.",
    ],
  },
  {
    slug: "how-to-explain-test-pi-checkout-to-customers",
    title: "How to explain Test-Pi checkout to customers without creating confusion",
    excerpt:
      "If your storefront launches on testnet first, the interface needs to teach trust and expectation at the same time.",
    category: "Pi commerce",
    publishedAt: "July 2026",
    readTime: "4 min read",
    coverNote: "Testnet UX",
    body: [
      "A testnet-first launch is normal for Pi apps, but the interface must say so in plain language. Customers should know whether they are making a practice transaction, whether goods are mock or real, and what happens after payment.",
      "The best pattern is to keep the payment button real, the backend verification real, and the copy unmistakable. Labels like Test-Pi, Sandbox, or Trial checkout should appear near the action itself, not hidden in documentation.",
      "That clarity helps Mushroom.Pi feel professional even before the main catalog and live fulfillment are fully online. A clear test stage is more credible than a vague unfinished launch.",
    ],
  },
  {
    slug: "building-a-mushroom-brand-with-editorial-depth",
    title: "Building a mushroom brand with editorial depth, not just product cards",
    excerpt:
      "Why the blog matters if the store will eventually do most of the work.",
    category: "Content",
    publishedAt: "July 2026",
    readTime: "6 min read",
    coverNote: "Editorial moat",
    body: [
      "An 80 percent storefront can still earn trust through writing. The blog is where Mushroom.Pi can slow down, teach, and turn transactions into a brand relationship.",
      "Articles about sourcing, routines, preparation, kitchen use, and common misconceptions all make the store feel less generic. They also give returning visitors more reasons to come back even when they are not ready to buy.",
      "In practice, that means the site should not separate store and content too aggressively. Instead, product detail and editorial narrative should reinforce each other throughout the experience.",
    ],
  },
  {
    slug: "what-to-prepare-before-mainnet",
    title: "What to prepare before moving Mushroom.Pi from testnet to a wider Pi rollout",
    excerpt:
      "A checklist for the day your Pi experience stops being a prototype and starts behaving like a real business surface.",
    category: "Operations",
    publishedAt: "July 2026",
    readTime: "7 min read",
    coverNote: "Launch readiness",
    body: [
      "Before expanding beyond test flows, the site needs clean product data, clear order tracking logic, and a reliable backend record for every Pi payment state. Approval and completion events should never be treated as optional details.",
      "Operationally, you will also want a clearer refund, support, and fulfillment plan. Even in a Pi-native environment, customer confidence still depends on familiar commerce basics.",
      "From the brand side, the domain, logo system, and content voice should already feel settled. That way, when live traffic increases, Mushroom.Pi presents as a brand with intent rather than a technical experiment.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
