import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import type { Content } from "../../@types/content";
import { Play, X, Volume2, VolumeX, Maximize, Settings, Pause, SkipForward, SkipBack, Loader } from 'lucide-react';
interface VideoPlayerProps {
  content: Content;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ content, onClose }) => {
  const { state, dispatch } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [showSettings, setShowSettings] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const progress = state.profile.watchProgress[content.id] || 0;

  useEffect(() => {
    if (videoRef.current && progress > 0) {
      videoRef.current.currentTime = (progress / 100) * duration;
    }
  }, [duration, progress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && duration > 0) {
        const progress = (currentTime / duration) * 100;
        dispatch({
          type: 'UPDATE_WATCH_PROGRESS',
          payload: { contentId: content.id, progress }
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTime, duration, content.id, dispatch]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={content.videoUrl}
        className="w-full h-full"
        autoPlay
        onClick={togglePlay}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
          <div className="text-white">
            <h2 className="text-2xl font-bold">{content.title}</h2>
            <p className="text-sm text-gray-300">{content.genre.join(' • ')}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-white/20 backdrop-blur-sm p-6 rounded-full hover:bg-white/30 transition"
            >
              <Play size={48} className="text-white" fill="white" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:text-gray-300">
                {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
              </button>
              <button onClick={() => skip(-10)} className="text-white hover:text-gray-300">
                <SkipBack size={24} />
              </button>
              <button onClick={() => skip(10)} className="text-white hover:text-gray-300">
                <SkipForward size={24} />
              </button>
              <button onClick={toggleMute} className="text-white hover:text-gray-300">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-gray-300"
                >
                  <Settings size={24} />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-3 min-w-[200px]">
                    <div className="mb-3">
                      <p className="text-white text-sm mb-2">Playback Speed</p>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => changePlaybackSpeed(speed)}
                          className={`block w-full text-left px-3 py-2 rounded text-sm ${
                            playbackSpeed === speed ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                    <div>
                      <p className="text-white text-sm mb-2">Quality</p>
                      {['2160p', '1080p', '720p', '480p', 'Auto'].map(q => (
                        <button
                          key={q}
                          onClick={() => setQuality(q)}
                          className={`block w-full text-left px-3 py-2 rounded text-sm ${
                            quality === q ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};