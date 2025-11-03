import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string; // absolute or root-relative
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const absoluteUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://gamecam.io';
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function SEO({ title, description, canonical, image, noIndex, jsonLd }: SEOProps) {
  const canonicalUrl = absoluteUrl(canonical);
  const imageUrl = absoluteUrl(image);
  const pageTitle = title ? `${title}` : 'GameCam │ AI-powered hardware';
  const pageDesc = description ||
    'GameCam builds intelligent padel hardware: GAMETRAQ AI match camera and SHOTGUN ball machine.';

  const jsonLdScript = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : undefined;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {pageDesc && <meta name="description" content={pageDesc} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content="GameCam" />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={pageTitle} />
      {pageDesc && <meta property="og:description" content={pageDesc} />} 
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {pageDesc && <meta name="twitter:description" content={pageDesc} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {jsonLdScript && jsonLdScript.map((obj, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
