import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * ThirdParty injects optional analytics/marketing/chat scripts when corresponding
 * Vite env variables are present. Nothing loads by default.
 *
 * Supported env variables:
 * - VITE_GA_MEASUREMENT_ID (e.g., G-XXXXXX)
 * - VITE_GTM_ID (e.g., GTM-XXXXXX)
 * - VITE_META_PIXEL_ID
 * - VITE_LINKEDIN_PARTNER_ID
 * - VITE_HOTJAR_ID & VITE_HOTJAR_SV
 * - VITE_CRISP_WEBSITE_ID
 */
export default function ThirdParty() {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;
  const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
  const LINKEDIN_PARTNER_ID = import.meta.env.VITE_LINKEDIN_PARTNER_ID as string | undefined;
  const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID as string | undefined;
  const HOTJAR_SV = import.meta.env.VITE_HOTJAR_SV as string | undefined;
  const CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID as string | undefined;

  // Meta Pixel init
  useEffect(() => {
    if (!META_PIXEL_ID) return;
    const w = window as any;
    if (!w.fbq) {
      w.fbq = function () {
        (w.fbq.q = w.fbq.q || []).push(arguments);
      };
      w.fbq.q = w.fbq.q || [];
      w.fbq.version = '2.0';
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }
    w.fbq('init', META_PIXEL_ID);
    w.fbq('track', 'PageView');
  }, [META_PIXEL_ID]);

  // Hotjar init
  useEffect(() => {
    if (!HOTJAR_ID || !HOTJAR_SV) return;
    const w = window as any;
    w.hj = w.hj || function () { (w.hj.q = w.hj.q || []).push(arguments); };
    w._hjSettings = { hjid: Number(HOTJAR_ID), hjsv: Number(HOTJAR_SV) };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${w._hjSettings.hjid}.js?sv=${w._hjSettings.hjsv}`;
    document.head.appendChild(script);
  }, [HOTJAR_ID, HOTJAR_SV]);

  // Crisp chat init
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;
    const w = window as any;
    w.$crisp = w.$crisp || [];
    w.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);
  }, [CRISP_WEBSITE_ID]);

  return (
    <Helmet>
      {/* Google Analytics 4 */}
      {GA_MEASUREMENT_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
          <script>{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}</script>
        </>
      )}

      {/* Google Tag Manager */}
      {GTM_ID && (
        <script>{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</script>
      )}

      {/* LinkedIn Insight */}
      {LINKEDIN_PARTNER_ID && (
        <script>{`
          _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}</script>
      )}
      {LINKEDIN_PARTNER_ID && (
        <script>{`
          (function(l) { if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
          var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
          s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
          var b = document.getElementsByTagName('script')[0]; b.parentNode.insertBefore(s, b);
          })(window.lintrk);
        `}</script>
      )}

      {/* Meta Pixel noscript (image) */}
      {META_PIXEL_ID && (
        <noscript>
          {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />`}
        </noscript>
      )}

      {/* GTM noscript iframe recommendation: add the following in the app body if you need full compliance.
          Wappalyzer detection works with the script alone, so we keep DOM clean. */}
    </Helmet>
  );
}
