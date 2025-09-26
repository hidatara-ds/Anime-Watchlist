export type AnimeStatus = 'Watching' | 'Completed' | 'Plan to Watch' | 'Dropped';

export interface Anime {
  id: string;
  title: string;
  episodes: number;
  status: AnimeStatus;
  rating: number | null;
  notes: string;
  coverImage?: string; // Optional: stored as a data URL
}
