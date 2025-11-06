import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { getProductBySlug } from '../data/products';
import { countries, countryDialCode } from '../data/countries';

interface FormState {
  name: string;
  isCompany: boolean;
  companyName: string;
  taxNumber: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressCountry: string;
  phone: string;
  email: string;
  quantity: number;
  message: string;
}

const initialState: FormState = {
  name: '',
  isCompany: false,
  companyName: '',
  taxNumber: '',
  addressStreet: '',
  addressCity: '',
  addressState: '',
  addressZip: '',
  addressCountry: '',
  phone: '',
  email: '',
  quantity: 1,
  message: ''
};

function OrderFormPage() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const title = product ? `Order ${product.name} │ GameCam` : 'Order │ GameCam';
  const canonical = product ? `/order/${product.slug}` : '/order';

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  // I parse the numeric unit price from priceLabel (e.g., "€2,950"); if missing I default to 2950
  const unitPrice = useMemo(() => {
    if (!product?.priceLabel) return 2950;
    const match = product.priceLabel.match(/€\s*([\d,.]+)/);
    if (match && match[1]) {
      const numeric = Number(match[1].replace(/,/g, ''));
      if (!Number.isNaN(numeric)) return numeric;
    }
    return 2950;
  }, [product]);

  const subtotal = useMemo(() => unitPrice * (form.quantity || 0), [unitPrice, form.quantity]);

  const emailLines = useMemo(() => {
    if (!product) return [] as string[];
    const companyOrPrivate = form.isCompany ? 'Company' : 'Private person (+ VAT)';
    const combinedAddress = [
      form.addressStreet,
      form.addressCity,
      form.addressState,
      form.addressZip,
      form.addressCountry
    ]
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .join(', ');
    return [
      `Product: ${product.name}`,
      `Name: ${form.name}`,
      `Ordering as: ${companyOrPrivate}`,
      form.isCompany ? `Company name: ${form.companyName}` : undefined,
      form.isCompany ? `Tax/VAT number: ${form.taxNumber}` : undefined,
      `Delivery address: ${combinedAddress}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Quantity: ${form.quantity}`,
      `Unit price: ${formatCurrency(unitPrice)}`,
      `Subtotal: ${formatCurrency(subtotal)}`,
      `Total (excl. VAT): ${formatCurrency(subtotal)} + shipping`,
      form.message ? `Extra message: ${form.message}` : undefined,
    ].filter(Boolean) as string[];
  }, [product, form, unitPrice, subtotal]);

  const emailSubject = useMemo(() => (product ? `Order request: ${product.name}` : 'Order request'), [product]);
  const emailBodyText = useMemo(() => emailLines.join('\r\n'), [emailLines]);
  const emailBodyEncoded = useMemo(() => encodeURIComponent(emailBodyText), [emailBodyText]);

  const mailtoHref = useMemo(() => {
    if (!product) return '#';
    const subject = encodeURIComponent(emailSubject);
    return `mailto:sales@gamecam.se?subject=${subject}&body=${emailBodyEncoded}`;
  }, [product, emailSubject, emailBodyEncoded]);

  const gmailHref = useMemo(() => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('sales@gamecam.se')}&su=${encodeURIComponent(emailSubject)}&body=${emailBodyEncoded}`;
  }, [emailSubject, emailBodyEncoded]);

  // I only surface Gmail compose in the UI to keep the flow simple

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const setField = (key: keyof FormState, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const markTouched = (key: keyof FormState) => setTouched((t) => ({ ...t, [key]: true }));

  const normalizePhone = (raw: string) => {
    // I keep only digits and a leading +
    let v = raw.replace(/[^\d+]/g, '');
    if (v && v[0] !== '+') v = '+' + v.replace(/[^\d]/g, '');
    // Basic clamp to max 16 chars to avoid runaway input
    return v.slice(0, 16);
  };

  const ensureDialCode = (phone: string, country: string) => {
    const code = countryDialCode[country];
    if (!code) return phone;
    if (!phone.startsWith('+')) return code + phone.replace(/[^\d]/g, '');
    return phone;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your full name.';
    if (!form.addressStreet.trim()) e.addressStreet = 'Please enter a street address.';
    if (!form.addressCity.trim()) e.addressCity = 'Please enter a city.';
    if (!form.addressZip.trim()) e.addressZip = 'Please enter a ZIP/postal code.';
    if (!form.addressCountry.trim()) e.addressCountry = 'Please enter a country.';
    if (!form.phone.trim()) e.phone = 'Please enter a phone number.';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.quantity || form.quantity < 1) e.quantity = 'Quantity must be at least 1.';
    if (form.isCompany) {
      if (!form.companyName.trim()) e.companyName = 'Company name is required for company orders.';
      if (!form.taxNumber.trim()) e.taxNumber = 'Tax/VAT number is required for company orders.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateField = (key: keyof FormState, value: string) => {
    const e: Record<string, string> = {};
    switch (key) {
      case 'name':
        if (!value.trim()) e.name = 'Please enter your full name.';
        break;
      case 'addressStreet':
        if (!value.trim()) e.addressStreet = 'Please enter a street address.';
        break;
      case 'addressCity':
        if (!value.trim()) e.addressCity = 'Please enter a city.';
        break;
      case 'addressZip':
        if (!value.trim()) e.addressZip = 'Please enter a ZIP/postal code.';
        break;
      case 'addressCountry':
        if (!value.trim()) e.addressCountry = 'Please select a country.';
        break;
      case 'phone':
        if (!value.trim()) e.phone = 'Please enter a phone number.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) e.email = 'Please enter a valid email.';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, ...e, [key]: (e as any)[key] || '' }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
  // I prefer the serverless proxy to avoid CORS; I fall back to a direct endpoint if configured
    const proxyEndpoint = '/api/order';
    const directEndpoint = import.meta.env.VITE_GSHEET_ENDPOINT;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const deliveryAddressCombined = [
        form.addressStreet,
        form.addressCity,
        form.addressState,
        form.addressZip,
        form.addressCountry
      ]
        .map((s) => (s || '').trim())
        .filter(Boolean)
        .join(', ');
      const payload = {
        product: product.name,
        name: form.name,
        isCompany: form.isCompany,
        companyName: form.companyName,
        taxNumber: form.taxNumber,
        deliveryAddress: deliveryAddressCombined,
        phone: form.phone,
        email: form.email,
        quantity: form.quantity,
        message: form.message,
        unitPrice,
        subtotal,
        // I keep total equal to subtotal here (VAT added for private individuals later)
        total: subtotal,
        currency: 'EUR',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      };
      // I try the proxy first (no CORS issues)
      let res = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        // If the proxy fails (e.g., not deployed yet), I try the direct Apps Script endpoint
        if (directEndpoint) {
          try {
            const directRes = await fetch(directEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!directRes.ok) {
              // As a last resort I send a fire-and-forget no-cors request
              await fetch(directEndpoint, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
            }
          } catch {
            // I ignore errors here and let the email fallback handle it
          }
        } else {
          // If no direct endpoint exists, I fall back to email
          throw new Error('Proxy failed and no direct endpoint configured');
        }
      }
      setSubmitted(true);
    } catch (err: any) {
      // If the network fails, I fall back to email to guarantee delivery
      setSubmitError('We could not reach the order endpoint. We will open your mail app as a fallback.');
      window.location.href = mailtoHref;
    } finally {
      setSubmitting(false);
    }
  };

  const productDeck =
    product.slug === 'gametraq'
      ? '/assets/pdfs/GAMETRAQDECK.pdf'
      : product.slug === 'shotgun'
        ? '/assets/pdfs/SHOTGUNDECK.pdf'
        : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-blue/5 via-white to-white p-4 sm:p-6">
      <SEO
        title={title}
        description={`Submit a purchase request for ${product.name}. A GameCam team member will follow up with delivery details and next steps.`}
        canonical={canonical}
        image={product.image}
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 rounded-[32px] border border-brand-blue/15 bg-white/95 p-4 shadow-card backdrop-blur-sm md:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* I show the product summary here to keep the form context clear */}
          <aside className="rounded-2xl border border-brand-blue/10 bg-white p-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Order</p>
              <h1 className="text-3xl font-bold text-brand-blue">{product.name}</h1>
              <p className="text-sm font-medium text-brand-blue/80">{product.tagline}</p>
              <p className="text-sm text-neutral-700">{product.summary}</p>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border border-brand-blue/10 bg-neutral-50 p-4">
              <img src={product.image} alt={product.name} className="mx-auto h-40 w-auto object-contain" decoding="async" />
            </div>
            <div className="mt-5 grid gap-4">
              <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
                {product.features.slice(0, 3).map((f) => (
                  <li key={f.title} className="marker:text-brand-pink">
                    <span className="font-semibold text-brand-blue">{f.title}:</span> {f.description}
                  </li>
                ))}
              </ul>
              {productDeck && (
                <a
                  href={productDeck}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 bg-white px-4 py-2 text-xs font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
                >
                  Download product deck
                </a>
              )}
            </div>
          </aside>

          {/* I keep the full order form in this panel */}
          <section className="rounded-2xl border border-brand-blue/10 bg-white p-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Order form</p>
              <p className="text-sm text-neutral-700">Fill in your details below. If you are a private individual, VAT will be added.</p>
            </div>
        {submitted ? (
          <div className="mt-6 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6 text-sm text-brand-blue">
            <p className="font-semibold">Thanks! Your order request was sent.</p>
            <p className="mt-2 text-neutral-700">
              We will get back to you shortly with delivery details and next steps. If you don’t hear from us, please
              email <a className="underline" href="mailto:sales@gamecam.se">sales@gamecam.se</a> and include your product and contact details.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-brand-blue">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                required
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue">
                <input
                  type="checkbox"
                  checked={form.isCompany}
                  onChange={(e) => setField('isCompany', e.target.checked)}
                  className="h-4 w-4 rounded border-brand-blue/30 text-brand-pink focus:ring-brand-pink"
                />
                Ordering as a company
              </label>
            </div>
          </div>

          {form.isCompany && (
            <>
              <div>
                <label className="block text-sm font-medium text-brand-blue">Company name</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setField('companyName', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                />
                {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue">Tax/VAT number</label>
                <input
                  type="text"
                  value={form.taxNumber}
                  onChange={(e) => setField('taxNumber', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                />
                {errors.taxNumber && <p className="mt-1 text-xs text-red-600">{errors.taxNumber}</p>}
              </div>
            </>
          )}

          {!form.isCompany && (
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-brand-blue/10 bg-brand-blue/5 px-3 py-2 text-xs text-brand-blue">
                As a private person, VAT will be added.
              </div>
            </div>
          )}    

          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brand-blue">Street</label>
              <input
                type="text"
                value={form.addressStreet}
                onChange={(e) => setField('addressStreet', e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                required
              />
              {errors.addressStreet && <p className="mt-1 text-xs text-red-600">{errors.addressStreet}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue">City</label>
              <input
                type="text"
                value={form.addressCity}
                onChange={(e) => setField('addressCity', e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                required
              />
              {errors.addressCity && <p className="mt-1 text-xs text-red-600">{errors.addressCity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue">State / County (optional)</label>
              <input
                type="text"
                value={form.addressState}
                onChange={(e) => setField('addressState', e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue">ZIP / Postal code</label>
              <input
                type="text"
                value={form.addressZip}
                onChange={(e) => setField('addressZip', e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                required
              />
              {errors.addressZip && <p className="mt-1 text-xs text-red-600">{errors.addressZip}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue">Country</label>
              <select
                value={form.addressCountry}
                onChange={(e) => {
                  const next = e.target.value;
                  setField('addressCountry', next);
                  // I auto-prefix phone with country dial code if user hasn't typed + yet
                  if (form.phone && !form.phone.startsWith('+')) {
                    const prefixed = ensureDialCode(normalizePhone(form.phone), next);
                    setField('phone', prefixed);
                  }
                  if (touched.addressCountry) validateField('addressCountry', next);
                }}
                onBlur={(e) => { markTouched('addressCountry'); validateField('addressCountry', e.target.value); }}
                className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                required
              >
                <option value="" disabled>Select a country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {touched.addressCountry && errors.addressCountry && <p className="mt-1 text-xs text-red-600">{errors.addressCountry}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-blue">Phone number</label>
            <input
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => {
                const normalized = normalizePhone(e.target.value);
                const ensured = ensureDialCode(normalized, form.addressCountry);
                setField('phone', ensured);
                if (touched.phone) validateField('phone', ensured);
              }}
              onBlur={(e) => { markTouched('phone'); validateField('phone', e.target.value); }}
              placeholder={countryDialCode[form.addressCountry] ? `${countryDialCode[form.addressCountry]} …` : '+46 …'}
              className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
              required
            />
            {touched.phone && errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => { setField('email', e.target.value); if (touched.email) validateField('email', e.target.value); }}
              onBlur={(e) => { markTouched('email'); validateField('email', e.target.value); }}
              className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
              required
            />
            {touched.email && errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-blue">Quantity</label>
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => setField('quantity', Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
              required
            />
            {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
            <div className="mt-2 text-xs text-neutral-700">
              {form.quantity || 0} × {formatCurrency(unitPrice)} = <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-brand-blue">Estimate (excl. VAT): {formatCurrency(subtotal)} + shipping</div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-brand-blue">Extra message</label>
            <textarea
              value={form.message}
              onChange={(e) => setField('message', e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
              rows={4}
            />
          </div>

          <div className="lg:col-span-2 mt-2 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-pink disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit order request'}
            </button>
            {submitError && <p className="mt-2 text-xs text-red-600">{submitError}</p>}
          </div>
        </form>
        )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrderFormPage;
