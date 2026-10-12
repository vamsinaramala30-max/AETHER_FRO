import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Music,
} from 'lucide-react';
import { formatFileSize } from '../fileCapabilityDetector';

export interface AudioViewerProps {
  url: string;
  filename: string;
  size?: number;
  downloadUrl?: string;
}

export const AudioViewer: React.FC<AudioViewerProps> = ({
  url,
  filename,
  size,
  downloadUrl,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center p-8 text-white select-none">
      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Album Artwork Ambient Card */}
      <div className="relative mb-8 flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-500 to-indigo-600 shadow-2xl shadow-amber-500/20">
        <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950/40 backdrop-blur-md ${isPlaying ? 'animate-pulse' : ''}`}>
          <Music className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-base font-bold text-slate-100 truncate max-w-md">{filename}</h3>
        {size && size > 0 && (
          <p className="text-xs text-slate-400 mt-1">{formatFileSize(size)} • Audio Master</p>
        )}
      </div>

      {/* Audio Player Controls Box */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          {/* Playback speed */}
          <button
            type="button"
            onClick={cycleSpeed}
            title="Cycle Playback Speed"
            className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 hover:bg-white/10"
          >
            {playbackRate}x
          </button>

          {/* Center Play/Pause button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) audioRef.current.currentTime = 0;
              }}
              title="Restart"
              className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={filename}
                title="Download Audio"
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Volume toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 accent-amber-500 cursor-pointer h-1 rounded-lg bg-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
