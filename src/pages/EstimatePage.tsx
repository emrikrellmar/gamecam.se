import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { products as allProducts } from '../data/products';
import { countries, countryDialCode } from '../data/countries';

interface FormState {
  name: string;
  clubName: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  products: Record<string, number>;
  message: string;
}

const initialState: FormState = {
  name: '',
  clubName: '',
  phone: '',
  email: '',
  city: '',
  country: '',
  products: {},
  message: ''
};

function EstimatePage() {
  const { slug } = useParams();

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Pre-select product if slug is present
  useEffect(() => {
    if (slug) {
      const product = allProducts.find(p => p.slug === slug);
      if (product) {
        setForm(prev => ({
          ...prev,
          products: { ...prev.products, [product.name]: 1 }
        }));
      }
    }
  }, [slug]);

  const title = 'Get an estimate │ GameCam';
  const canonical = '/estimate';

  const emailLines = useMemo(() => {
    const productLines = Object.entries(form.products)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => `${name}: ${qty}`);

    return [
      `Products:`,
      ...productLines,
      `Name: ${form.name}`,
      `Club/Company: ${form.clubName}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Location: ${form.city}, ${form.country}`,
      form.message ? `Extra message: ${form.message}` : undefined,
    ].filter(Boolean) as string[];
  }, [form]);

  const emailSubject = 'Estimate request';
  const emailBodyText = useMemo(() => emailLines.join('\r\n'), [emailLines]);
  const emailBodyEncoded = useMemo(() => encodeURIComponent(emailBodyText), [emailBodyText]);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(emailSubject);
    return `mailto:magnus@gamecam.se?subject=${subject}&body=${emailBodyEncoded}`;
  }, [emailSubject, emailBodyEncoded]);

  const setField = (key: keyof FormState, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  // Update phone placeholder when country changes
  useEffect(() => {
    if (form.country && countryDialCode[form.country] && !form.phone) {
      // Optional: Pre-fill the phone input with the dial code if empty
      // setForm(prev => ({ ...prev, phone: countryDialCode[form.country] }));
    }
  }, [form.country]);

  const setProductQuantity = (productName: string, qty: number) => {
    setForm(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productName]: Math.max(0, qty)
      }
    }));
  };

  const markTouched = (key: keyof FormState) => setTouched((t) => ({ ...t, [key]: true }));

  const normalizePhone = (raw: string) => {
    let v = raw.replace(/[^\d+]/g, '');
    if (v && v[0] !== '+') v = '+' + v.replace(/[^\d]/g, '');
    return v.slice(0, 16);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your full name.';
    if (!form.clubName.trim()) e.clubName = 'Please enter your club or company name.';
    if (!form.phone.trim()) e.phone = 'Please enter a phone number.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.city.trim()) e.city = 'Please enter your city.';
    if (!form.country.trim()) e.country = 'Please select your country.';
    
    const hasProducts = Object.values(form.products).some(qty => qty > 0);
    if (!hasProducts) e.products = 'Please select at least one product.';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateField = (key: keyof FormState, value: string) => {
    const e: Record<string, string> = {};
    switch (key) {
      case 'name':
        if (!value.trim()) e.name = 'Please enter your full name.';
        break;
      case 'clubName':
        if (!value.trim()) e.clubName = 'Please enter your club or company name.';
        break;
      case 'phone':
        if (!value.trim()) e.phone = 'Please enter a phone number.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) e.email = 'Please enter a valid email.';
        break;
      case 'city':
        if (!value.trim()) e.city = 'Please enter your city.';
        break;
      case 'country':
        if (!value.trim()) e.country = 'Please select your country.';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, ...e, [key]: (e as any)[key] || '' }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const proxyEndpoint = '/api/estimate';

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      const payload = {
        products: form.products,
        name: form.name,
        clubName: form.clubName,
        phone: form.phone,
        email: form.email,
        city: form.city,
        country: form.country,
        message: form.message,
      };

      let res = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to send estimate request');
      }
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError('We could not reach the estimate endpoint. We will open your mail app as a fallback.');
      window.location.href = mailtoHref;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-blue/5 via-white to-white p-4 sm:p-6">
      <SEO
        title={title}
        description="Submit an estimate request. A GameCam team member will follow up with details."
        canonical={canonical}
      />

      <div className="mx-auto max-w-3xl">
        <div className="rounded-[32px] border border-brand-blue/15 bg-white/95 p-4 shadow-card backdrop-blur-sm md:p-8">
          <div className="space-y-2 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Estimate form</p>
            <h1 className="text-3xl font-bold text-brand-blue">Get an estimate</h1>
            <p className="text-sm text-neutral-700">Fill in your details below and we'll get back to you shortly with an estimate.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6 text-sm text-brand-blue">
              <p className="font-semibold">Thanks! Your estimate request was sent.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-brand-blue">Full name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                    required
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-brand-blue">Club / Company Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.clubName}
                    onChange={(e) => setField('clubName', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                    required
                  />
                  {errors.clubName && <p className="mt-1 text-xs text-red-600">{errors.clubName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-blue">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setField('city', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                    required
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-blue">Country <span className="text-red-500">*</span></label>
                  <select
                    value={form.country}
                    onChange={(e) => setField('country', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-blue">Phone number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => {
                      const normalized = normalizePhone(e.target.value);
                      setField('phone', normalized);
                      if (touched.phone) validateField('phone', normalized);
                    }}
                    onBlur={(e) => { markTouched('phone'); validateField('phone', e.target.value); }}
                    placeholder={form.country && countryDialCode[form.country] ? `${countryDialCode[form.country]}...` : '+46...'}
                    className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                    required
                  />
                  {touched.phone && errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-blue">Email address <span className="text-red-500">*</span></label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-blue mb-3">Products</label>
                <div className="grid gap-4 sm:grid-cols-2">
                  {allProducts.map((product) => (
                    <div key={product.slug} className="rounded-xl border border-brand-blue/15 p-4 flex items-center justify-between bg-neutral-50">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-12 w-12 object-contain" />
                        <p className="font-semibold text-brand-blue">{product.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setProductQuantity(product.name, (form.products[product.name] || 0) - 1)}
                          className="h-8 w-8 rounded-full border border-brand-blue/20 bg-white text-brand-blue hover:bg-brand-blue hover:text-white transition flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-brand-blue">{form.products[product.name] || 0}</span>
                        <button
                          type="button"
                          onClick={() => setProductQuantity(product.name, (form.products[product.name] || 0) + 1)}
                          className="h-8 w-8 rounded-full border border-brand-blue/20 bg-white text-brand-blue hover:bg-brand-blue hover:text-white transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.products && <p className="mt-2 text-xs text-red-600">{errors.products}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-blue">Extra message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setField('message', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-blue/20 bg-white px-3 py-2 text-sm outline-none focus:border-brand-pink"
                  rows={4}
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-pink disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Request Estimate'}
                </button>
                {submitError && <p className="mt-2 text-xs text-red-600">{submitError}</p>}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EstimatePage;
