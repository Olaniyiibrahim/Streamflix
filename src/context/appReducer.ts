
// ===========================
// TYPE DEFINITIONS
// ===========================

interface Content {
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

interface UserProfile {
  id: string;
  name: string;
  watchHistory: string[];
  watchlist: string[];
  preferences: string[];
  watchProgress: Record<string, number>;
}

interface AppState {
  content: Content[];
  profile: UserProfile;
  selectedContent: Content | null;
  searchQuery: string;
  activeTab: 'home' | 'movies' | 'series' | 'watchlist';
  isPlaying: boolean;
  currentPlayingId: string | null;
  notifications: Notification[];
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

type Action =
  | { type: 'SET_CONTENT'; payload: Content[] }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_SELECTED_CONTENT'; payload: Content | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: AppState['activeTab'] }
  | { type: 'TOGGLE_WATCHLIST'; payload: string }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'UPDATE_WATCH_PROGRESS'; payload: { contentId: string; progress: number } }
  | { type: 'START_PLAYING'; payload: string }
  | { type: 'STOP_PLAYING' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };




export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    
    case 'SET_SELECTED_CONTENT':
      return { ...state, selectedContent: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'TOGGLE_WATCHLIST':
      const isInList = state.profile.watchlist.includes(action.payload);
      return {
        ...state,
        profile: {
          ...state.profile,
          watchlist: isInList
            ? state.profile.watchlist.filter(id => id !== action.payload)
            : [...state.profile.watchlist, action.payload]
        }
      };
    
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        profile: {
          ...state.profile,
          watchHistory: [
            action.payload,
            ...state.profile.watchHistory.filter(id => id !== action.payload)
          ].slice(0, 50)
        }
      };
    
    case 'UPDATE_WATCH_PROGRESS':
      return {
        ...state,
        profile: {
          ...state.profile,
          watchProgress: {
            ...state.profile.watchProgress,
            [action.payload.contentId]: action.payload.progress
          }
        }
      };
    
    case 'START_PLAYING':
      return { ...state, isPlaying: true, currentPlayingId: action.payload };
    
    case 'STOP_PLAYING':
      return { ...state, isPlaying: false, currentPlayingId: null };
    
    case 'ADD_NOTIFICATION':
      const notification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: Date.now()
      };
      return {
        ...state,
        notifications: [...state.notifications, notification]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    default:
      return state;
  }
}