"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";

const chapters = [
  { name: "Entrance & Living Room", time: 0, label: "0:00" },
  { name: "Kitchen & Dining", time: 20, label: "0:20" },
  { name: "Master Bedroom", time: 45, label: "0:45" },
];

export default function VideoTour({ poster }: { poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const updateFullscreen = () => setFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  async function play() {
    const video = videoRef.current;
    if (!video) return;
    setError("");
    try {
      await video.play();
    } catch (reason) {
      console.error("Unable to play the property walkthrough:", reason);
      setError("Unable to play the walkthrough. Please try again.");
    }
  }

  function jumpTo(time: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
    void play();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === playerRef.current) {
        await document.exitFullscreen();
      } else if (playerRef.current?.requestFullscreen) {
        await playerRef.current.requestFullscreen();
      } else {
        setError("Fullscreen is not supported by this browser.");
      }
    } catch (reason) {
      console.error("Unable to change fullscreen mode:", reason);
      setError("Unable to change fullscreen mode. Please try again.");
    }
  }

  const activeChapter = chapters.reduce((active, chapter, index) => currentTime >= chapter.time ? index : active, 0);

  return (
    <div className="video-tour" ref={playerRef}>
      <div className="video-screen">
        <video
          ref={videoRef}
          className="tour-video"
          src="/videos/house.mp4"
          poster={poster}
          preload="metadata"
          playsInline
          aria-label="Property video walkthrough"
          onLoadedData={() => setLoading(false)}
          onCanPlay={() => setLoading(false)}
          onWaiting={() => setLoading(true)}
          onPlaying={() => { setPlaying(true); setLoading(false); }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onError={() => { setLoading(false); setError("The walkthrough video could not be loaded."); }}
        />
        {loading && !error && <div className="video-loading" role="status">Preparing your walkthrough...</div>}
        <div className="video-controls">
          <button type="button" onClick={() => playing ? videoRef.current?.pause() : void play()} aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button type="button" onClick={() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted; }} aria-label={muted ? "Unmute walkthrough" : "Mute walkthrough"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <span>VIDEO WALKTHROUGH</span>
          <button type="button" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
      {error && <p className="video-error" role="alert">{error}</p>}
      <div className="video-chapters" aria-label="Room chapters">
        <span>ROOM JUMP</span>
        <div>
          {chapters.map((chapter, index) => (
            <button type="button" key={chapter.time} className={index === activeChapter ? "active" : ""} aria-pressed={index === activeChapter} onClick={() => jumpTo(chapter.time)}>
              {chapter.name} <small>{chapter.label}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
