import React from 'react';

const MeetPage: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-white">
      <iframe 
        src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2rcxusdOhDjRi4a6g9RSNTz-rYLV3SCR2INtYgy6T9jeUbMAUerT-Ry_OXOj9Q23zZiJmfUZdk?gv=true" 
        style={{ border: 0 }} 
        width="100%" 
        height="100%" 
        frameBorder="0"
        title="Schedule a meeting"
        allow="camera; microphone; fullscreen"
      ></iframe>
    </div>
  );
};

export default MeetPage;
