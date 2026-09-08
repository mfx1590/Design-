/**
 * Service pages (PLAN.md §6). English source copy, grounded in the brief; nothing about pricing,
 * timelines or team is claimed beyond what the owner confirmed. Moves into Sanity later.
 */
export type ServiceKey = "staging" | "rental" | "custom";

export interface ServiceContent {
  key: ServiceKey;
  slug: string;
  title: string;
  /** Two or three sentences that answer the question the page exists for. */
  lead: string;
  audience: string;
  steps: Array<{ title: string; body: string }>;
  pricing: string;
  pricingNote?: string;
  faqs: Array<{ q: string; a: string }>;
  photos: Array<{ src: string; alt: string }>;
  prefill: string;
}

const IMG = "/images/projects/project-01-studio";

export const services: ServiceContent[] = [
  {
    key: "staging",
    slug: "home-staging",
    title: "Home staging",
    lead: "Home staging furnishes and styles an empty unit so it photographs well and shows well. For sellers and agents in Northern Cyprus who want a property to look like a home before the first viewing.",
    audience: "Sellers and estate agents",
    steps: [
      { title: "Walkthrough or floor plan", body: "We look at the unit in person or from the plan and photos." },
      { title: "Staging plan and quote", body: "Which rooms, which pieces, for how long. One price." },
      { title: "Delivery and styling", body: "Furniture, textiles and accessories arrive together and are placed by our team." },
      { title: "Photos and viewings", body: "The unit is ready for the listing photos and for visitors." },
    ],
    pricing: "Priced per property, depending on size and how long the staging stays in place.",
    pricingNote: "Pricing model to be confirmed by the owner.",
    faqs: [
      { q: "Can the buyer keep the furniture?", a: "Ask us. Staged pieces can usually be bought with the property or replaced by a full package." },
      { q: "Do you stage occupied homes?", a: "Yes, where the layout allows. We add or replace pieces rather than clearing the home." },
    ],
    photos: [
      { src: `${IMG}/after-landscape.jpg`, alt: "Furnished studio ready for viewings" },
      { src: `${IMG}/after-portrait-wide.jpg`, alt: "Sofa, dressing mirror and bed in the studio" },
    ],
    prefill: "Hello, I would like to ask about home staging for a property in Northern Cyprus.",
  },
  {
    key: "rental",
    slug: "rental-furnishing",
    title: "Rental furnishing",
    lead: "Rental furnishing uses the same Studio, 1+1 and 2+1 packages, chosen for the purpose: durable and neutral for long-term tenants, or guest-ready down to kitchenware and linen for holiday lets. Furnished units rent faster and are ready for listing photos on day one.",
    audience: "Owners and investors who rent out",
    steps: [
      { title: "Choose the purpose", body: "Long-term tenants or holiday guests. The package changes with the answer." },
      { title: "Package adjusted", body: "Durable finishes and easy maintenance for long lets; full equipment and photogenic styling for short lets." },
      { title: "Delivered before the season", body: "Timed to your handover or to the start of the letting season." },
      { title: "Ready to list", body: "Photos, keys, and a unit that can receive its first guest." },
    ],
    pricing: "Studio from £10,000, 1+1 from £12,000, 2+1 from £14,000. Same structure as the standard packages.",
    pricingNote: "Rental-specific inclusions to be confirmed by the owner.",
    faqs: [
      { q: "What does a holiday-let package add?", a: "Everything a guest expects on arrival: kitchenware, linen, towels and the small things, plus styling that photographs well." },
      { q: "What is different for long-term tenants?", a: "Neutral colours, durable fabrics and surfaces, and pieces that are easy to clean and replace." },
    ],
    photos: [
      { src: `${IMG}/after-kitchen.jpg`, alt: "Equipped kitchen with breakfast bar" },
      { src: `${IMG}/after-bathroom.jpg`, alt: "Bathroom with towels and accessories" },
    ],
    prefill: "Hello, I would like to ask about furnishing a rental apartment in Northern Cyprus.",
  },
  {
    key: "custom",
    slug: "custom-projects",
    title: "Custom projects",
    lead: "Custom projects are individual design projects beyond the standard packages: larger homes, special layouts, or a brief that does not fit Studio, 1+1 or 2+1. Same process, priced for the project.",
    audience: "Owners with a larger home or a specific brief",
    steps: [
      { title: "Brief", body: "What you have, what you need, how you will use it." },
      { title: "Concept", body: "Layout, materials and a piece list for every room." },
      { title: "Selection", body: "You approve the pieces, in person or remotely." },
      { title: "Delivery and installation", body: "Everything arrives together and is installed by our team." },
    ],
    pricing: "Quoted per project after the brief.",
    faqs: [
      { q: "Do you work with developers?", a: "Yes. Turnkey furnishing for show units and whole projects is handled as a custom project." },
      { q: "Can I mix a package with custom pieces?", a: "Yes. Start from the closest package and change what you need." },
    ],
    photos: [
      { src: `${IMG}/after-terrace.jpg`, alt: "Terrace dining set by the pool" },
      { src: `${IMG}/after-landscape-bar.jpg`, alt: "Breakfast bar, bed and sofa in the studio" },
    ],
    prefill: "Hello, I would like to ask about a custom furnishing project in Northern Cyprus.",
  },
];

export function serviceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
