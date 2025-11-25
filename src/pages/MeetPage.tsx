import React from 'react';

const MeetPage: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white">
      <iframe 
        src="https://calendar.app.google/vdUXfpaFFTtPX6vg6" 
        style={{ border: 0 }} 
        width="100%" 
        height="100%" 
        frameBorder="0"
        title="Schedule a meeting"
      ></iframe>
    </div>
  );
};

export default MeetPage;
