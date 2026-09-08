/** Reviews (PLAN.md §6). None until real ones arrive with the client's permission; the page shows an honest empty state. */
export interface ReviewContent {
  clientName: string;
  city: string | null;
  rating: number;
  text: string;
  date: string | null;
}

export const reviews: ReviewContent[] = [];
