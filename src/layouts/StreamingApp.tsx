import { useEffect, useMemo } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useAppContext } from "../context/AppContext";
import { generateMockContent } from "../api/mockContent";
import { Loader, Search, Play, Plus, Check, Star, Home, Film, Tv, Bookmark, User, X, Volume2  } from "lucide-react";
import { NotificationCenter } from "../components/common/NotificationCenter";
import { ContentCard } from "../components/content/ContentCard";
import { Carousel } from "../components/content/Carousel";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { useQuery } from "../hooks/useQuery";


export const StreamingApp: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  const { data: content, isLoading } = useQuery(
    'content-library',
    () => generateMockContent(10000),
    { staleTime: 600000, refetchInterval: 300000 }
  );

  useEffect(() => {
    if (content) {
      dispatch({ type: 'SET_CONTENT', payload: content });
    }
  }, [content, dispatch]);

  const debouncedSearch = useDebounce(state.searchQuery, 300);

  const filteredContent = useMemo(() => {
    let filtered = state.content;

    if (state.activeTab === 'movies') filtered = filtered.filter(c => c.type === 'movie');
    if (state.activeTab === 'series') filtered = filtered.filter(c => c.type === 'series');
    if (state.activeTab === 'watchlist') filtered = filtered.filter(c => state.profile.watchlist.includes(c.id));

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.genre.some(g => g.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [state.content, state.activeTab, state.profile.watchlist, debouncedSearch]);

  const recommendations = useMemo(() => {
    return state.content
      .filter(c => c.genre.some(g => state.profile.preferences.includes(g)))
      .slice(0, 20);
  }, [state.content, state.profile.preferences]);

  const trending = useMemo(() => state.content.filter(c => c.trending).slice(0, 20), [state.content]);
  const featured = useMemo(() => state.content.find(c => c.featured) || state.content[0], [state.content]);

  const continueWatching = useMemo(() => {
    return state.content
      .filter(c => state.profile.watchHistory.includes(c.id) && (state.profile.watchProgress[c.id] || 0) < 90)
      .slice(0, 10);
  }, [state.content, state.profile.watchHistory, state.profile.watchProgress]);

  const handleFeaturedClick = () => {
    if (!featured) return;
    dispatch({ type: 'SET_SELECTED_CONTENT', payload: featured });
    dispatch({ type: 'ADD_TO_HISTORY', payload: featured.id });
    dispatch({ type: 'START_PLAYING', payload: featured.id });
  };

  const handleFeaturedWatchlist = () => {
    if (!featured) return;
    dispatch({ type: 'TOGGLE_WATCHLIST', payload: featured.id });
    const isInList = state.profile.watchlist.includes(featured.id);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: isInList ? 'Removed from watchlist' : 'Added to watchlist',
        type: 'success'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NotificationCenter />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-red-600">STREAMFLIX</h1>
            <div className="flex gap-4">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'movies', icon: Film, label: 'Movies' },
                { id: 'series', icon: Tv, label: 'Series' },
                { id: 'watchlist', icon: Bookmark, label: 'My List' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id as any })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition ${
                    state.activeTab === tab.id ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search titles, genres..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                className="bg-black/50 border border-gray-700 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-white transition"
              />
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition">
              <User size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!state.searchQuery && state.activeTab === 'home' && featured && (
        <div className="relative h-[70vh] mb-8">
          <div className="absolute inset-0">
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          <div className="relative h-full flex items-center px-12">
            <div className="max-w-xl">
              <h2 className="text-6xl font-bold mb-4">{featured.title}</h2>
              <div className="flex items-center gap-3 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  {featured.rating}
                </span>
                <span>{featured.year}</span>
                <span>{featured.duration}</span>
                <span className="px-2 py-0.5 border border-gray-400 text-xs">{featured.type.toUpperCase()}</span>
              </div>
              <p className="text-lg text-gray-300 mb-6">{featured.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleFeaturedClick}
                  className="bg-white text-black px-8 py-3 rounded flex items-center gap-2 font-semibold hover:bg-gray-200 transition"
                >
                  <Play size={20} fill="currentColor" />
                  Play
                </button>
                <button
                  onClick={handleFeaturedWatchlist}
                  className="bg-gray-500/70 text-white px-8 py-3 rounded flex items-center gap-2 font-semibold hover:bg-gray-500 transition"
                >
                  {state.profile.watchlist.includes(featured.id) ? <Check size={20} /> : <Plus size={20} />}
                  My List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="px-4 pt-32">
        {state.searchQuery ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 px-4">
              Search Results for "{state.searchQuery}" ({filteredContent.length} titles)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
              {filteredContent.slice(0, 50).map(item => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onClick={() => {
                    dispatch({ type: 'SET_SELECTED_CONTENT', payload: item });
                    dispatch({ type: 'ADD_TO_HISTORY', payload: item.id });
                    dispatch({ type: 'START_PLAYING', payload: item.id });
                  }}
                  onAddToWatchlist={() => {
                    dispatch({ type: 'TOGGLE_WATCHLIST', payload: item.id });
                    const isInList = state.profile.watchlist.includes(item.id);
                    dispatch({
                      type: 'ADD_NOTIFICATION',
                      payload: {
                        message: isInList ? 'Removed from watchlist' : 'Added to watchlist',
                        type: 'success'
                      }
                    });
                  }}
                  isInWatchlist={state.profile.watchlist.includes(item.id)}
                  watchProgress={state.profile.watchProgress[item.id]}
                  lazy={false}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {state.activeTab === 'home' && continueWatching.length > 0 && (
              <Carousel title="Continue Watching" items={continueWatching} />
            )}

            {state.activeTab === 'home' && (
              <>
                <Carousel title="Trending Now" items={trending} />
                <Carousel title="Recommended for You" items={recommendations} />
              </>
            )}

            <Carousel
              title={
                state.activeTab === 'movies' ? 'All Movies' :
                state.activeTab === 'series' ? 'All Series' :
                state.activeTab === 'watchlist' ? 'Your Watchlist' :
                'Popular This Week'
              }
              items={filteredContent.slice(0, 50)}
            />

            {state.activeTab === 'home' && (
              <>
                <Carousel
                  title="Action & Adventure"
                  items={state.content.filter(c => c.genre.includes('Action')).slice(0, 20)}
                />
                <Carousel
                  title="Sci-Fi & Fantasy"
                  items={state.content.filter(c => c.genre.includes('Sci-Fi')).slice(0, 20)}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Video Player Modal */}
      {state.isPlaying && state.selectedContent && (
        <VideoPlayer
          content={state.selectedContent}
          onClose={() => {
            dispatch({ type: 'STOP_PLAYING' });
            dispatch({ type: 'SET_SELECTED_CONTENT', payload: null });
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-20 px-8 py-8 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>StreamFlix © 2026 | {state.content.length.toLocaleString()} titles available</p>
          <div className="flex gap-4">
            <span>Watchlist: {state.profile.watchlist.length}</span>
            <span>•</span>
            <span>History: {state.profile.watchHistory.length}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
