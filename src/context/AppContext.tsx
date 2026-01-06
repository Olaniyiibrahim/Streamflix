import { createContext, useContext } from "react";
import type { Content, Notification } from "../@types/content";
import type { Action, UserProfile } from "../@types/action";

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



export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};