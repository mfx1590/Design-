/**
 * Legal pages (PLAN.md §6). Templates for the owner to complete: every fact the site cannot know
 * is in square brackets. They describe only what the site actually does today (WhatsApp handover,
 * a locale cookie, a browser-only inquiry list, no analytics, no contact form).
 */
export interface LegalContent {
  slug: "privacy" | "cookies" | "terms";
  title: string;
  updated: string;
  sections: Array<{ heading: string; body: string[] }>;
}

const OWNER = "[Company legal name], [registered address], [registration number]";

export const legal: LegalContent[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: "2026-09-08",
    sections: [
      {
        heading: "Who we are",
        body: [`This website is operated by ${OWNER} (“we”). Questions about this policy: [contact email].`],
      },
      {
        heading: "What we collect",
        body: [
          "The site has no contact form and no account system. When you write to us on WhatsApp, WhatsApp (Meta Platforms) shares with us your phone number, your profile name and the content of your message, including any floor plans or photos you send. We use them to answer your request and prepare a proposal.",
          "Our hosting provider records technical server logs (IP address, browser, pages requested, time) to keep the site running and secure. [Hosting provider and retention period to be confirmed.]",
          "The inquiry list on the furniture pages is stored only in your own browser (local storage). It is not sent to us until you choose to send it on WhatsApp.",
        ],
      },
      {
        heading: "Why we may process it",
        body: [
          "To respond to your request and prepare a quote (steps before a contract). To fulfil a contract once you order a package. To meet legal obligations such as accounting. Our legitimate interest in keeping the site secure.",
        ],
      },
      {
        heading: "Who receives it",
        body: [
          "WhatsApp / Meta Platforms, as the messaging service you choose to use, under its own privacy terms. Our hosting provider, as a processor. Suppliers and delivery partners, only as far as needed to deliver and install your order. No advertising networks.",
        ],
      },
      {
        heading: "How long we keep it",
        body: ["Conversation history and proposals: [period, e.g. until the request is closed plus X years]. Invoices and contracts: as long as accounting law requires. Server logs: [period]."],
      },
      {
        heading: "Your rights",
        body: [
          "You can ask for a copy of your data, ask us to correct or delete it, object to processing based on legitimate interest, and complain to your data protection authority. Write to [contact email].",
          "[If visitors from the EU/EEA or the UK are addressed, name the applicable law (GDPR / UK GDPR), the legal basis per purpose and any international transfer safeguards. To be confirmed with a lawyer.]",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    updated: "2026-09-08",
    sections: [
      {
        heading: "Cookies we set",
        body: [
          "NEXT_LOCALE: remembers the language you chose so the site opens in it next time. Strictly necessary for the language switch. Lifetime: one year.",
          "No analytics, advertising or social media cookies are set. Should analytics be added later, this page will be updated and consent requested where the law requires it.",
        ],
      },
      {
        heading: "Local storage",
        body: [
          "dp-inquiry: the list of furniture pieces you saved on the furniture pages. It stays in your browser and is never transmitted automatically. Clear it with the Clear list button on the inquiry page or through your browser settings.",
        ],
      },
      {
        heading: "Third parties",
        body: [
          "Links to WhatsApp open the WhatsApp application or website, which apply their own cookies and policies. Fonts are served by [self-hosted / Google Fonts, to be confirmed].",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of use",
    updated: "2026-09-08",
    sections: [
      {
        heading: "The website",
        body: [
          `This website is published by ${OWNER}. It presents furniture packages and services for apartments in Northern Cyprus. Using the site does not create a contract.`,
        ],
      },
      {
        heading: "Prices and proposals",
        body: [
          "Prices shown on the site are in pounds sterling (GBP) and are starting prices (“from”). They are indicative until confirmed in a written proposal. A contract exists only when a proposal has been accepted in writing and any agreed deposit has been paid. [Payment terms, deposit share and cancellation rules to be confirmed.]",
        ],
      },
      {
        heading: "Photographs and visualisations",
        body: [
          "Photographs show completed projects. Where an image is a visualisation based on a completed project, it is labelled as such. Pieces, colours and availability may vary from the images.",
        ],
      },
      {
        heading: "Intellectual property",
        body: ["Texts, photographs, drawings and the site design belong to the publisher or its licensors. They may not be copied or reused without written permission."],
      },
      {
        heading: "Liability",
        body: [
          "We keep the site accurate but do not guarantee that every detail is current. To the extent permitted by law, we are not liable for loss arising from reliance on the site outside a written contract. [Limitation clause to be checked against the applicable law.]",
        ],
      },
      {
        heading: "Applicable law",
        body: ["[Governing law and jurisdiction to be confirmed.]"],
      },
    ],
  },
];

export function legalBySlug(slug: LegalContent["slug"]) {
  return legal.find((l) => l.slug === slug)!;
}
