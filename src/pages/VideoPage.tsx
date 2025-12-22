import React from 'react';

const VideoPage: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white">
      <iframe
        src="https://www.youtube.com/embed/IzHm5CCqLXk"
        style={{ border: 0 }}
        width="100%"
        height="100%"
        title="GAMETRAQ Demo Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPage;
