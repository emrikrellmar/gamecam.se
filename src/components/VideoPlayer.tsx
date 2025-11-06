import { useEffect, useRef, useState, type SyntheticEvent, type VideoHTMLAttributes } from 'react';

interface VideoPlayerProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'controls'> {
  wrapperClassName?: string;
  // I can auto-play when the video enters the viewport (muted only due to browser policies)
  autoPlayWhenVisible?: boolean;
  // I start muted until user interaction
  startMuted?: boolean;
  // If true, I unmute on first click on the video element
  unmuteOnClick?: boolean;
  // If false, never show native browser controls
  showControlsOnPlay?: boolean;
  // Start playback at N seconds (trim initial part without editing the file)
  startAtSeconds?: number;
}

function VideoPlayer({
  wrapperClassName,
  className,
  poster,
  src,
  onPlay,
  onPause,
  onEnded,
  autoPlayWhenVisible = false,
  startMuted = false,
  unmuteOnClick = false,
  showControlsOnPlay = true,
  startAtSeconds = 0,
  preload = 'metadata',
  ...videoProps
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [muted, setMuted] = useState<boolean>(startMuted);
  const initialSeekDone = useRef<boolean>(false);

  const applyInitialSeek = () => {
    const video = videoRef.current;
    if (!video) return;
    if (startAtSeconds > 0 && !initialSeekDone.current) {
      try {
        // Only seek safely once metadata is available
        if (video.readyState >= 1 /* HAVE_METADATA */) {
          video.currentTime = startAtSeconds;
          initialSeekDone.current = true;
        }
      } catch {
        // ignore seek errors
      }
    }
  };

  const handleStart = () => {
    const video = videoRef.current;
    if (!video) return;

    if (startMuted) {
      video.muted = true;
      setMuted(true);
    }
    // Try to apply initial seek for manual start as well
    applyInitialSeek();
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
    if (showControlsOnPlay) setShowControls(true);
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
  const videoClasses = ['aspect-video w-full object-cover', className]
    .filter(Boolean)
    .join(' ');

  // I auto-play when visible if requested
  useEffect(() => {
    if (!autoPlayWhenVisible) return;
    const video = videoRef.current;
    if (!video) return;
    video.playsInline = true;
    video.muted = startMuted;
    setMuted(startMuted);
    setShowOverlay(false); // no overlay for auto-play block

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Try to seek before play if metadata is available
            applyInitialSeek();
            video.play().catch(() => {/* ignore */});
          } else {
            // Pause when out of view to save CPU
            video.pause();
          }
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [autoPlayWhenVisible, startMuted, startAtSeconds]);

  // Ensure we seek once metadata is loaded (covers cases where IO play happens before metadata)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoadedMeta = () => applyInitialSeek();
    video.addEventListener('loadedmetadata', onLoadedMeta);
    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMeta);
    };
  }, [startAtSeconds]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (unmuteOnClick && muted) {
      video.muted = false;
      setMuted(false);
      if (showControlsOnPlay) setShowControls(true);
    }
  };

  return (
    <div className={containerClasses}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload={preload}
        className={videoClasses}
  controls={showControls && showControlsOnPlay}
        muted={muted}
        playsInline
        onClick={handleVideoClick}
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        onEnded={handleEndedEvent}
        {...videoProps}
      />
      {showOverlay && !autoPlayWhenVisible && (
        <button
          type="button"
          onClick={handleStart}
          className="absolute inset-0 flex items-center justify-center text-white"
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
