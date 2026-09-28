'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { baseAPI } from '../../config/api';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', message: '', website: '' };

const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#22B2A8] focus:border-transparent';

const Field = ({ label, id, error, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// Fields match the old WordPress form; submissions are stored by the API
// (POST /contact) and appear under Messages in the dashboard.
const ContactForm = () => {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | sending | sent | failed

    const set = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrors({});

        try {
            // pageUrl is forwarded to the CRM webhook as "Page URL".
            const response = await baseAPI.contact.submit({ ...form, pageUrl: window.location.href });
            if (response?.success) {
                setStatus('sent');
                setForm(EMPTY);
                return;
            }
            // Validation errors arrive as [{ path: 'body.email', message }].
            const fieldErrors = {};
            (Array.isArray(response?.error) ? response.error : []).forEach(({ path, message }) => {
                const field = String(path).replace(/^body\./, '');
                fieldErrors[field] ??= message;
            });
            setErrors(fieldErrors);
            setStatus('failed');
        } catch {
            setStatus('failed');
        }
    };

    if (status === 'sent') {
        return (
            <div className="text-center py-10" role="status">
                <CheckCircle2 className="w-12 h-12 text-[#22B2A8] mx-auto" />
                <h3 className="mt-4 text-xl font-bold text-[#1b1b1b]">Thanks for getting in touch</h3>
                <p className="mt-2 text-gray-600">Our admissions team will contact you soon.</p>
                <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm font-semibold text-[#1a9d8f] hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    const hasFieldErrors = Object.values(errors).some(Boolean);

    return (
        <form onSubmit={handleSubmit} noValidate={false} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First name" id="contact-first-name" error={errors.firstName}>
                    <input
                        id="contact-first-name"
                        type="text"
                        autoComplete="given-name"
                        required
                        maxLength={100}
                        value={form.firstName}
                        onChange={set('firstName')}
                        placeholder="Enter first name"
                        className={inputClass}
                    />
                </Field>
                <Field label="Last name" id="contact-last-name" error={errors.lastName}>
                    <input
                        id="contact-last-name"
                        type="text"
                        autoComplete="family-name"
                        required
                        maxLength={100}
                        value={form.lastName}
                        onChange={set('lastName')}
                        placeholder="Enter last name"
                        className={inputClass}
                    />
                </Field>
            </div>

            <Field label="Email" id="contact-email" error={errors.email}>
                <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                    value={form.email}
                    onChange={set('email')}
                    placeholder="Enter email address"
                    className={inputClass}
                />
            </Field>

            <Field label="Phone number" id="contact-phone" error={errors.phone}>
                <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={30}
                    pattern="[0-9()#&+*\-=. ]+"
                    title="Only numbers and phone characters (#, -, *, etc.) are accepted."
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="Enter phone number"
                    className={inputClass}
                />
            </Field>

            <Field label="Message" id="contact-message" error={errors.message}>
                <textarea
                    id="contact-message"
                    rows={6}
                    maxLength={5000}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Your message"
                    className={`${inputClass} resize-y`}
                />
            </Field>

            {/* Honeypot: invisible to people, so only bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={set('website')}
                />
            </div>

            {status === 'failed' && !hasFieldErrors && (
                <p className="text-sm text-red-600" role="alert">
                    Sorry, your message could not be sent. Please try again, or email us at
                    info@veritaspathways.co.uk.
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#22B2A8] text-white font-bold uppercase tracking-wide hover:bg-[#1a9d8f] transition-colors disabled:opacity-70"
            >
                {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'sending' ? 'Sending…' : 'Submit'}
            </button>
        </form>
    );
};

export default ContactForm;
