import type { Content } from '../@types/content';

export const generateMockContent = (count: number): Content[] => {
  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary'];
  const titles = ['The Last Journey', 'Midnight Eclipse', 'Beyond Horizons', 'Silent Echoes', 'Digital Dreams', 
    'Urban Legends', 'Quantum Break', 'Shadow Protocol', 'Crystal Dawn', 'Neon Nights'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `content-${i}`,
    title: `${titles[i % titles.length]} ${Math.floor(i / titles.length) + 1}`,
    type: i % 3 === 0 ? 'series' : 'movie',
    genre: [genres[i % genres.length], genres[(i + 1) % genres.length]],
    rating: Math.round((3 + Math.random() * 2) * 10) / 10,
    year: 2018 + (i % 7),
    duration: i % 3 === 0 ? `${1 + (i % 3)} Seasons` : `${90 + (i % 60)}min`,
    thumbnail: `https://picsum.photos/seed/${i}/400/225`,
    description: `An epic ${genres[i % genres.length].toLowerCase()} experience that will keep you on the edge of your seat. Follow the journey through unexpected twists and compelling characters.`,
    trending: i % 5 === 0,
    featured: i % 15 === 0,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }));
};