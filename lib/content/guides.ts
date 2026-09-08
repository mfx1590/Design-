/**
 * Guides (PLAN.md §6, §9). Two grounded articles, written only from what the site already states
 * (package contents, the six steps, the rental versions). No market figures, no legal claims.
 * Moves into Sanity later; the owner can add more from the Studio.
 */
export interface GuideContent {
  slug: string;
  title: string;
  lead: string;
  /** ISO date of the last edit. */
  updated: string;
  cover: { src: string; alt: string };
  sections: Array<{ heading: string; body: string[] }>;
}

const IMG = "/images/projects/project-01-studio";

export const guides: GuideContent[] = [
  {
    slug: "furnishing-from-abroad",
    title: "Furnishing an apartment in Northern Cyprus from abroad",
    lead: "Many buyers are not in Cyprus when the keys are handed over. This is how a furniture package works when you are somewhere else.",
    updated: "2026-09-08",
    cover: { src: `${IMG}/after-landscape.jpg`, alt: "A furnished studio with a breakfast bar, bed and sofa, the pool visible through the sliding door" },
    sections: [
      {
        heading: "Start with three things",
        body: [
          "A floor plan, the handover date, and how you will use the apartment: to live in, to rent long-term, or to let to holiday guests. Those three answers decide the package version and the timing.",
          "Send them on WhatsApp and you receive a first proposal without a visit. A short video walk-through of the empty apartment helps, but a plan from the developer is enough to start.",
        ],
      },
      {
        heading: "Concept and selection happen online",
        body: [
          "The concept is a layout and a shortlist for every room, priced as one package. You review it from drawings and photos, ask for changes, and approve the pieces in writing on WhatsApp.",
          "Because the package is defined by apartment type, the shortlist already covers every room. What changes with your answers is the character of the pieces, not the list of rooms.",
        ],
      },
      {
        heading: "Delivery and installation are timed to the handover",
        body: [
          "Delivery and installation are part of every package. Everything arrives together, timed to your handover date, and is assembled, placed and styled by our team.",
          "You do not need to be present. If the developer or your representative hands over the keys, installation can happen before you fly in.",
        ],
      },
      {
        heading: "Handover with photos",
        body: [
          "When the installation is complete you receive handover photos of every room the same day. If you arrive later, the apartment waits furnished. If it is going on the rental market, those photos are the start of the listing.",
        ],
      },
      {
        heading: "What to decide early",
        body: [
          "Whether the apartment is for you, for long-term tenants or for holiday guests. The rooms are the same, the choices differ: your own colours, comfort and storage if you are moving in; durable and neutral, easy to maintain between tenants, for long-term rental; guest-ready down to kitchenware and linen for holiday lets.",
          "The package finder on the packages page turns those answers into a package and a WhatsApp message in three taps.",
        ],
      },
    ],
  },
  {
    slug: "studio-1-plus-1-2-plus-1-what-is-included",
    title: "Studio, 1+1 or 2+1: what a furniture package includes",
    lead: "Packages are defined by apartment type, not by a quality tier. Here is what each one covers and where the prices start.",
    updated: "2026-09-08",
    cover: { src: `${IMG}/after-landscape-bar.jpg`, alt: "Breakfast bar with terracotta stools, a bed and a sofa in one furnished studio" },
    sections: [
      {
        heading: "One price for the whole apartment",
        body: [
          "A package furnishes every room of the apartment type and includes delivery and installation. Prices are in pounds sterling and are starting prices: the final quote depends on the pieces you approve.",
        ],
      },
      {
        heading: "Studio, from £10,000",
        body: [
          "Living and sleeping area, kitchen and dining, bathroom, delivery and installation. In a studio the living and sleeping area is one room, so the layout does the work: a bed, a sofa, a place to eat and storage that does not crowd the space.",
        ],
      },
      {
        heading: "1+1, from £12,000",
        body: ["Living room, one bedroom, kitchen and dining, bathroom, delivery and installation. The bedroom is furnished as a full room: bed, wardrobe or storage, bedside pieces and textiles."],
      },
      {
        heading: "2+1, from £14,000",
        body: ["Living room, two bedrooms, kitchen and dining, bathroom, delivery and installation. The second bedroom can be set up for family, guests or as a home office; the choice is made at the concept stage."],
      },
      {
        heading: "The rental version",
        body: [
          "Each package also exists as a rental version with the same room structure. For long-term tenants the pieces are durable and neutral, easy to maintain between tenancies. For holiday lets the apartment is guest-ready down to kitchenware and linen, and photogenic for listings.",
        ],
      },
      {
        heading: "Still to be confirmed",
        body: [
          "Terrace furniture and the delivery timeline are listed as to be confirmed on the comparison table until the owner confirms them. Ask on WhatsApp and you get the current answer for your handover date.",
        ],
      },
    ],
  },
];

export function guideBySlug(slug: string) {
  return guides.find((g) => g.slug === slug);
}
