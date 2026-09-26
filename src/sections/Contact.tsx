import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themeConfig } from '../theme/theme.config';
import { SplitTextComponent } from '../components/ui/SplitText';
import { Button } from '../components/ui/Button';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useMagnetic({ strength: themeConfig.cursor.magneticStrength });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    if (!data.name.trim()) newErrors.name = 'Name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Invalid email format';
    if (!data.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(formData);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', company: '', message: '' });
    
    // Reset status after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-content > *', 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.contact-content', start: 'top 80%' }}
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen py-20 px-6"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="contact-content grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SplitTextComponent
              split="lines"
              stagger={0.1}
              duration={1}
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            >
              <h2 
                id="contact-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                style={{ 
                  fontFamily: themeConfig.typography.display.fontFamily,
                  background: `linear-gradient(135deg, ${themeConfig.palette.text} 0%, ${themeConfig.palette.glow} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ready to start?
              </h2>
            </SplitTextComponent>
            <SplitTextComponent
              split="lines"
              stagger={0.1}
              duration={1}
              delay={0.2}
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
            >
              <p className="mt-6 text-lg" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily, lineHeight: 1.7 }}>
                Join thousands of creators already building worlds with DREAMFRAME. 
                Get early access and shape the future of generative 3D.
              </p>
            </SplitTextComponent>

            <div className="mt-12 space-y-6">
              {[
                { icon: '🚀', title: 'Free Tier', desc: '10 renders/month, no credit card' },
                { icon: '🎨', title: 'All Styles', desc: 'Access to every preset and model' },
                { icon: '🤝', title: 'Community', desc: 'Private Discord with the team' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl transition-all" style={{ 
                  backgroundColor: `${themeConfig.palette.surface}80`,
                  border: `1px solid ${themeConfig.palette.surfaceAlt}40`,
                }}>
                  <span className="text-2xl mt-1">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold" style={{ color: themeConfig.palette.text, fontFamily: themeConfig.typography.display.fontFamily }}>
                      {item.title}
                    </h4>
                    <p className="text-sm mt-1" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="relative" noValidate>
            <div className="relative p-8 rounded-2xl" style={{ 
              backgroundColor: `${themeConfig.palette.surface}80`,
              border: `1px solid ${themeConfig.palette.surfaceAlt}40`,
              backdropFilter: 'blur(20px)',
            }}>
              {/* Floating 3D element placeholder */}
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-10" style={{ 
                background: `linear-gradient(135deg, ${themeConfig.palette.primary}, ${themeConfig.palette.accent})`,
                borderRadius: '50%',
                filter: 'blur(40px)',
              }} aria-hidden="true" />

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field 
                    label="Name" 
                    name="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={handleChange} 
                    error={errors.name}
                    required
                  />
                  <Field 
                    label="Email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    error={errors.email}
                    required
                  />
                </div>
                <Field 
                  label="Company (optional)" 
                  name="company" 
                  type="text" 
                  value={formData.company} 
                  onChange={handleChange} 
                />
                <Field 
                  label="Message" 
                  name="message" 
                  type="textarea" 
                  value={formData.message} 
                  onChange={handleChange} 
                  error={errors.message}
                  required
                  rows={4}
                />
                
                {submitStatus === 'success' && (
                  <div 
                    className="p-4 rounded-lg animate-slide-up"
                    role="alert"
                    style={{ backgroundColor: `${themeConfig.palette.primary}20`, border: `1px solid ${themeConfig.palette.primary}40` }}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span style={{ color: themeConfig.palette.primary, fontFamily: themeConfig.typography.body.fontFamily }}>
                        Thanks! We&apos;ll be in touch soon.
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  ref={submitRef}
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                  style={{ 
                    backgroundColor: themeConfig.palette.glow,
                    fontFamily: themeConfig.typography.body.fontFamily,
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      Creating your account...
                    </span>
                  ) : (
                    'Start Free Trial'
                  )}
                </Button>

                <p className="text-center text-sm" style={{ color: themeConfig.palette.textMuted, fontFamily: themeConfig.typography.body.fontFamily }}>
                  By continuing, you agree to our{' '}
                  <a href="#" className="underline hover:no-underline" style={{ color: themeConfig.palette.primary }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="underline hover:no-underline" style={{ color: themeConfig.palette.primary }}>Privacy Policy</a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  error, 
  required = false,
  rows = 3,
}: { 
  label: string; 
  name: string; 
  type: 'text' | 'email' | 'textarea'; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; 
  error?: string;
  required?: boolean;
  rows?: number;
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium mb-2" style={{ color: themeConfig.palette.text, fontFamily: themeConfig.typography.body.fontFamily }}>
        {label} {required && <span style={{ color: themeConfig.palette.glow }}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          className="w-full px-4 py-3 rounded-lg resize-none transition-all duration-300"
          style={{
            backgroundColor: themeConfig.palette.bg,
            border: `1px solid ${error ? themeConfig.palette.glow : isFocused ? themeConfig.palette.primary : themeConfig.palette.surfaceAlt}`,
            color: themeConfig.palette.text,
            fontFamily: themeConfig.typography.body.fontFamily,
            fontSize: '1rem',
            outline: 'none',
          }}
          placeholder={`Enter your ${label.toLowerCase()}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 rounded-lg transition-all duration-300"
          style={{
            backgroundColor: themeConfig.palette.bg,
            border: `1px solid ${error ? themeConfig.palette.glow : isFocused ? themeConfig.palette.primary : themeConfig.palette.surfaceAlt}`,
            color: themeConfig.palette.text,
            fontFamily: themeConfig.typography.body.fontFamily,
            fontSize: '1rem',
            outline: 'none',
          }}
          placeholder={`Enter your ${label.toLowerCase()}`}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm" role="alert" style={{ color: themeConfig.palette.glow, fontFamily: themeConfig.typography.body.fontFamily }}>
          {error}
        </p>
      )}
    </div>
  );
}