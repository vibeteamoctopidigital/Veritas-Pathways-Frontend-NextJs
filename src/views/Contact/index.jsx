import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import heroImage from '../../assets/contact/hero.jpg';
import ContactForm from './ContactForm';

// Copied from https://veritaspathways.co.uk/contact/.
const ADDRESS = '1 Dock Road, London, E16 1AH, UK';
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&t=m&z=15&output=embed&iwloc=near`;

const contactDetails = [
    { icon: Phone, label: '+44 20 3355 9930', href: 'tel:+442033559930' },
    { icon: Mail, label: 'info@veritaspathways.co.uk', href: 'mailto:info@veritaspathways.co.uk' },
    { icon: MapPin, label: ADDRESS, href: 'https://share.google/YgNH1zbF9nCQX5YAx', external: true },
];

const Contact = () => (
    <div className="font-nunito bg-white text-[#1b1b1b]">
        {/* Hero */}
        <section className="relative">
            <Image
                src={heroImage}
                alt=""
                fill
                priority
                placeholder="blur"
                sizes="100vw"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
            <div className="relative container mx-auto px-4 py-24 lg:py-32 text-center">
                <h1 className="text-white font-bold leading-tight text-4xl sm:text-5xl lg:text-[56px]">
                    Contact us
                </h1>
                <p className="mt-5 mx-auto max-w-2xl text-white/90 text-base sm:text-lg leading-relaxed">
                    Contact our admissions team for personalised guidance on courses, entry requirements, fees and
                    your pathway to a world-class education.
                </p>
            </div>
        </section>

        {/* Details and form */}
        <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    <div>
                        <h2 className="text-3xl sm:text-[40px] leading-tight font-bold">Let’s talk</h2>
                        <p className="mt-5 max-w-md text-lg text-gray-600 leading-relaxed">
                            Our team is ready to help you plan,{' '}
                            <Link href="/application" className="font-semibold text-[#1a9d8f] hover:underline">
                                apply
                            </Link>{' '}
                            and succeed with confidence.
                        </p>

                        <ul className="mt-8 space-y-5">
                            {contactDetails.map(({ icon: Icon, label, href, external }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="group inline-flex items-center gap-4 text-gray-700 hover:text-[#1a9d8f] transition-colors"
                                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    >
                                        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#d3efed] text-[#1a9d8f] shrink-0 group-hover:bg-[#1a9d8f] group-hover:text-white transition-colors">
                                            <Icon className="w-5 h-5" />
                                        </span>
                                        <span className="text-base">{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/application"
                            className="mt-10 inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#1a9d8f] text-white font-semibold hover:bg-[#158e88] transition-colors"
                        >
                            Start your application
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>

        {/* Map */}
        <section aria-label="Our location">
            <iframe
                src={MAP_EMBED}
                title={`Map showing ${ADDRESS}`}
                className="block w-full h-[400px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </section>
    </div>
);

export default Contact;
