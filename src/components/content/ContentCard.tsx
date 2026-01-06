import { memo, useRef, useState } from "react";
import type { Content } from "../../@types/content";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { Play, Plus, Check, Info, Star, TrendingUp} from 'lucide-react';
interface ContentCardProps {
  item: Content;
  onClick: () => void;
  onAddToWatchlist: () => void;
  isInWatchlist: boolean;
  watchProgress?: number;
  lazy?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = memo(({ 
  item, 
  onClick, 
  onAddToWatchlist, 
  isInWatchlist, 
  watchProgress = 0,
  lazy = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });

  return (
    <div
      ref={cardRef}
      className="relative flex-shrink-0 w-64 transition-transform duration-300 cursor-pointer group"
      style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-800">
        {(!lazy || isVisible) && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className={`w-full h-36 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        )}
        {!imageLoaded && <div className="w-full h-36 bg-gray-700 animate-pulse" />}
        
        {watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
            <div
              className="h-full bg-red-600"
              style={{ width: `${watchProgress}%` }}
            />
          </div>
        )}
        
        {item.trending && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <TrendingUp size={12} />
            Trending
          </div>
        )}

        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
              >
                <Play size={16} fill="currentColor" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onAddToWatchlist(); }}
                className="bg-gray-800/80 text-white rounded-full p-2 hover:bg-gray-700 transition border border-gray-600"
              >
                {isInWatchlist ? <Check size={16} /> : <Plus size={16} />}
              </button>
              <button className="bg-gray-800/80 text-white rounded-full p-2 hover:bg-gray-700 transition border border-gray-600">
                <Info size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400" fill="currentColor" />
                {item.rating}
              </span>
              <span>•</span>
              <span>{item.year}</span>
              <span>•</span>
              <span>{item.duration}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white truncate">{item.title}</h3>
        <p className="text-xs text-gray-400 truncate">{item.genre.join(' • ')}</p>
      </div>
    </div>
  );
});