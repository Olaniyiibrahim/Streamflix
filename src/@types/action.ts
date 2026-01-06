// ===========================
// TYPE DEFINITIONS
// ===========================
import type { Content } from './content';

export interface UserProfile {
  id: string;
  name: string;
  watchHistory: string[];
  watchlist: string[];
  preferences: string[];
  watchProgress: Record<string, number>;
}

export interface AppState {
  content: Content[];
  profile: UserProfile;
  selectedContent: Content | null;
  searchQuery: string;
  activeTab: 'home' | 'movies' | 'series' | 'watchlist';
  isPlaying: boolean;
  currentPlayingId: string | null;
  notifications: Notification[];
}



export type Action =
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

export interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lastFetched: number | null;
}