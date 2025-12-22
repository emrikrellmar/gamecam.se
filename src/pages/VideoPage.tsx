import React from 'react';

const VideoPage: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">GAMETRAQ demo video</h1>
      <div className="w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/IzHm5CCqLXk"
          style={{ border: 0 }}
          className="w-full h-full"
          title="GAMETRAQ Demo Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPage;
