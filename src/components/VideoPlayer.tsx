import { useRef, useState, type SyntheticEvent, type VideoHTMLAttributes } from 'react';

interface VideoPlayerProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'controls'> {
  wrapperClassName?: string;
}

function VideoPlayer({
  wrapperClassName,
  className,
  poster,
  src,
  onPlay,
  onPause,
  onEnded,
  preload = 'metadata',
  ...videoProps
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const handleStart = () => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If playback was prevented, keep the placeholder visible.
        setShowOverlay(true);
        setShowControls(false);
      });
    }
  };

  const handlePlayEvent = (event: SyntheticEvent<HTMLVideoElement>) => {
    setShowOverlay(false);
    setShowControls(true);
    onPlay?.(event);
  };

  const handlePauseEvent = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = videoRef.current;
    if (video && video.currentTime === 0) {
      setShowOverlay(true);
      setShowControls(false);
    }
    onPause?.(event);
  };

  const handleEndedEvent = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
    }
    setShowOverlay(true);
    setShowControls(false);
    onEnded?.(event);
  };

  const containerClasses = ['relative', 'group', wrapperClassName].filter(Boolean).join(' ');
  const videoClasses = ['aspect-video w-full rounded-[22px] object-cover', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload={preload}
        className={videoClasses}
        controls={showControls}
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        onEnded={handleEndedEvent}
        {...videoProps}
      />
      {showOverlay && (
        <button
          type="button"
          onClick={handleStart}
          className="absolute inset-0 flex items-center justify-center rounded-[22px] bg-neutral-900/40 text-white transition hover:bg-neutral-900/50"
          aria-label="Play video"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-blue shadow-lg transition group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 translate-x-[2px]"
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l9.13-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

export default VideoPlayer;
