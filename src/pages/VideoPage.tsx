import SEO from '../components/SEO';

function VideoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <SEO title="GAMETRAQ │ Video Demo" description="Watch the GAMETRAQ demo video." canonical="/video" />
      <h1 className="mb-8 text-3xl font-bold text-brand-blue">GAMETRAQ Demo Video</h1>
      <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/IzHm5CCqLXk"
          title="GAMETRAQ Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default VideoPage;
