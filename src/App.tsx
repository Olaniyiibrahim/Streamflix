import { useReducer } from "react";
import type { AppState } from "./@types/action";
import { StreamingApp } from "./layouts/StreamingApp";
import { appReducer } from "./context/appReducer";
import { AppContext } from "./context/AppContext";

const initialState: AppState = {
  content: [],
  profile: {
    id: 'user-1',
    name: 'User',
    watchHistory: [],
    watchlist: [],
    preferences: ['Action', 'Sci-Fi'],
    watchProgress: {}
  },
  selectedContent: null,
  searchQuery: '',
  activeTab: 'home',
  isPlaying: false,
  currentPlayingId: null,
  notifications: []
};
const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch}}>
      <StreamingApp />
    </AppContext.Provider>
  );
};

export default App;