import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { Content } from "../../@types/content";
import { useAppContext } from "../../context/AppContext";
import { ContentCard } from './ContentCard';
import { Search, Play, Plus, Check, ChevronLeft, ChevronRight, Info, Star, TrendingUp, Home, Film, Tv, Bookmark, User, X, Volume2, VolumeX, Maximize, Settings, Pause, SkipForward, SkipBack, Loader } from 'lucide-react';

interface CarouselProps {
  title: string;
  items: Content[];
}

export const Carousel: React.FC<CarouselProps> = memo(({ title, items }) => {
  const { state, dispatch } = useAppContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const targetScroll = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 300);
  };

  const handleContentClick = (content: Content) => {
    dispatch({ type: 'SET_SELECTED_CONTENT', payload: content });
    dispatch({ type: 'ADD_TO_HISTORY', payload: content.id});
    dispatch({ type: 'START_PLAYING', payload: content.id});
  };

  const handleAddToWatchlist = (contentId: string) => {
    dispatch({ type: 'TOGGLE_WATCHLIST', payload: contentId });
    const isInList = state.profile.watchlist.includes(contentId);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: isInList ? 'Removed from watchlist' : 'Added to watchlist',
        type: 'success'
      }
    });
  };

  return (
    <div className="relative group mb-8">
      <h2 className="text-xl font-bold text-white mb-4 px-4">{title}</h2>
      
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onClick={() => handleContentClick(item)}
            onAddToWatchlist={() => handleAddToWatchlist(item.id)}
            isInWatchlist={state.profile.watchlist.includes(item.id)}
            watchProgress={state.profile.watchProgress[item.id]}
          />
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
});