function StoryPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Our Story</p>
        <h1 className="text-4xl font-bold text-brand-blue">The Story of GameCam</h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          Pioneering vision, powered by intelligence. Magnus Jansson drives innovation at the intersection of sport, vision
          technology, and AI.
        </p>
      </section>

      <section className="space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card text-sm leading-relaxed text-neutral-700">
       <h2 className="text-lg font-semibold text-brand-blue">Magnus Jansson</h2>
        <p>
          Magnus Jansson is a visionary technologist and entrepreneur with a deep passion for pushing the boundaries of
          immersive media and intelligent vision systems. From reshaping virtual reality experiences to reinventing how racket
          sports are played and consumed, his work reflects a rare blend of creativity, technical excellence, and
          user-centric innovation.
        </p>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-brand-blue">From VR to 360-degree real-time video</h2>
          <p>
            Magnus's journey began as co-founder of COMOTION (2005-2012), where he led the development of groundbreaking VR
            and motion graphics solutions for the real estate and broadcast sectors. COMOTION's influence extended to the
            world of sports, becoming a proud sponsor of the Swedish Open Tennis for more than a decade.
          </p>
          <p>
            In 2012 he co-founded Briskeye Communication AB, introducing the world's first 360-degree video camera with
            real-time processing. This breakthrough redefined tactical awareness and situational intelligence for global law
            enforcement and military units. The camera technology continues to support high-risk operations by providing
            reliable, panoramic vision with immediate response capability.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-brand-blue">Global reach through VR and fan experience</h2>
          <p>
            With Raptor Vision in the United States, Magnus brought VR into mainstream entertainment, designing immersive
            experiences for top-tier clients like the NBA and Madison Square Garden. His work engaged fans on a deeper level
            and redefined interactive storytelling in live sports.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-brand-blue">GameCam: Elevating padel through technology</h2>
          <p>
            In 2020 Magnus partnered with Vivek from BTH to launch GameCam, a next-generation live-streaming and analytics
            platform built specifically for padel. What began as a high-speed, AI-powered broadcast camera has evolved into a
            comprehensive vision technology ecosystem for racket sports.
          </p>
          <p>At the heart of GameCam lies the the AI powered camera GAMETRAQ, a cutting-edge system delivering:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>4K live broadcasting</li>
            <li>AI-generated player statistics</li>
            <li>Real-time game analysis</li>
            <li>Cloud-based video storage and review tools</li>
          </ul>
          <p>These technologies are powered by our core strengths in:</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-brand-blue">Core competencies</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="space-y-2 rounded-3xl border border-brand-blue/10 bg-neutral-50 p-5">
              <h3 className="text-base font-semibold text-brand-blue">Computer vision</h3>
              <p>
                Our team specialises in advanced image recognition, object tracking, and scene reconstruction. From real-time
                ball trajectory analysis to precise player positioning, our vision algorithms are optimised for high-speed,
                dynamic environments.
              </p>
            </article>
            <article className="space-y-2 rounded-3xl border border-brand-blue/10 bg-neutral-50 p-5">
              <h3 className="text-base font-semibold text-brand-blue">Machine learning</h3>
              <p>Using supervised and unsupervised models, we extract actionable insights from gameplay data.</p>
              <ul className="list-disc space-y-1 pl-6 text-xs">
                <li>Automated highlights and event detection</li>
                <li>Performance metrics and player benchmarking</li>
                <li>Predictive analytics for coaching and strategy</li>
              </ul>
            </article>
            <article className="space-y-2 rounded-3xl border border-brand-blue/10 bg-neutral-50 p-5">
              <h3 className="text-base font-semibold text-brand-blue">Real-time processing and edge computing</h3>
              <p>
                With a foundation in embedded systems and real-time data pipelines, our technology delivers low-latency,
                high-resolution video and analytics on or off the court.
              </p>
            </article>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-brand-blue">Our vision</h2>
          <p>
            We are building the leading intelligent video platform for racket sports, blending AI, camera innovation, and a
            deep understanding of the game into one seamless solution. Under Magnus's leadership, we continue to challenge
            conventions and raise expectations.
          </p>
          <p>GAMETRAQ is more than a camera. It is a new lens on the sport that sees smarter, thinks faster, and plays better.</p>
        </div>

        <div className="space-y-1 text-sm text-brand-blue">
          <p className="font-semibold uppercase tracking-[0.3em]">Stay curious. Be hungry. Act friendly.</p>
        </div>
      </section>
    </div>
  );
}

export default StoryPage;
