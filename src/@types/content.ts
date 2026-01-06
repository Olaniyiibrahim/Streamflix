export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'series';
  genre: string[];
  rating: number;
  year: number;
  duration: string;
  thumbnail: string;
  description: string;
  trending: boolean;
  featured: boolean;
  videoUrl?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}


