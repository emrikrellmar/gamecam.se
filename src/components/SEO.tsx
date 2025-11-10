import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  // I allow absolute or root-relative image URLs for social cards.
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  ogType?: 'website' | 'article' | 'product';
  // Provide width/height for social images to avoid re-fetch on some crawlers
  imageWidth?: number;
  imageHeight?: number;
};

const absoluteUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://gamecam.io';
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function SEO({ title, description, canonical, image, imageAlt, noIndex, jsonLd, ogType = 'website', imageWidth, imageHeight }: SEOProps) {
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

  {/* I add Open Graph to improve link previews */}
  <meta property="og:site_name" content="GameCam" />
  <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={pageTitle} />
      {pageDesc && <meta property="og:description" content={pageDesc} />} 
  {imageUrl && <meta property="og:image" content={imageUrl} />}
  {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
  {imageWidth && <meta property="og:image:width" content={String(imageWidth)} />}
  {imageHeight && <meta property="og:image:height" content={String(imageHeight)} />}

      {/* I mirror the same data to Twitter cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {pageDesc && <meta name="twitter:description" content={pageDesc} />}
  {imageUrl && <meta name="twitter:image" content={imageUrl} />}
  {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
  <meta name="twitter:site" content="@gamecam" />

      {jsonLdScript && jsonLdScript.map((obj, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}

      {/* I provide a default robots directive when not explicitly disabled */}
      {!noIndex && <meta name="robots" content="index,follow" />}
    </Helmet>
  );
}
