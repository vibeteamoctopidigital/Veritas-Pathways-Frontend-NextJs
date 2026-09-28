import Image from 'next/image';
import Link from 'next/link';
import { Clock, Facebook, Instagram, Linkedin, Mail, Phone, Youtube } from 'lucide-react';
import logo from '../assets/Logo.png';

// Modelled on the veritaspathways.co.uk footer, with only the pages this site
// has. Details, social accounts and company numbers are copied from there.

// lucide has no X or TikTok marks, so these two are inline.
const XIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
);

const TikTokIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z" />
    </svg>
);

const socials = [
    { name: 'Facebook', href: 'https://www.facebook.com/veritas2025pathways', icon: Facebook },
    { name: 'Instagram', href: 'https://www.instagram.com/veritas_pathways/', icon: Instagram },
    { name: 'TikTok', href: 'https://www.tiktok.com/@veritaspathways', icon: TikTokIcon },
    { name: 'X', href: 'https://x.com/veritaspathway', icon: XIcon },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/veritaspathways/', icon: Linkedin },
    { name: 'YouTube', href: 'https://www.youtube.com/@veritas2025pathways/', icon: Youtube },
];

const linkGroups = [
    {
        title: 'Quick links',
        links: [
            { label: 'International Foundation Year', href: '/' },
            { label: 'University Progression', href: '/university-progression' },
            { label: 'Application form', href: '/application' },
            { label: 'Contact us', href: '/contact' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy policy', href: '/privacy-policy' },
            { label: 'Terms and conditions', href: '/terms-of-use' },
        ],
    },
];

const linkClass = 'text-gray-700 hover:text-[#22B2A8] transition-colors';

const Footer = () => (
    <footer className="bg-[#d3efed]/35 border-t border-gray-200 text-[#333333]">
        <div className="container mx-auto px-4 pt-14 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr] gap-10">
                {/* Brand and contact */}
                <div>
                    <Link href="/" className="inline-block hover:opacity-80 transition">
                        <Image src={logo} alt="Veritas Pathways" className="w-[150px] h-[42px]" />
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
                        We offer structured pathway programmes that help students advance to their next educational
                        stage.
                    </p>
                    <ul className="mt-5 space-y-2.5 text-sm">
                        <li>
                            <a href="tel:+442033559930" className={`inline-flex items-center gap-2 ${linkClass}`}>
                                <Phone className="w-4 h-4 text-[#22B2A8]" />
                                +44 20 3355 9930
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:info@veritaspathways.co.uk"
                                className={`inline-flex items-center gap-2 ${linkClass}`}
                            >
                                <Mail className="w-4 h-4 text-[#22B2A8]" />
                                info@veritaspathways.co.uk
                            </a>
                        </li>
                        <li className="inline-flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-[#22B2A8]" />
                            Mon–Fri, 9am–6pm (GMT)
                        </li>
                    </ul>
                </div>

                {linkGroups.map((group) => (
                    <div key={group.title}>
                        <h2 className="font-bold text-black">{group.title}</h2>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {group.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={linkClass}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Social */}
                <div>
                    <h2 className="font-bold text-black">Follow us</h2>
                    <ul className="mt-4 flex flex-wrap gap-2.5">
                        {socials.map(({ name, href, icon: Icon }) => (
                            <li key={name}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    title={name}
                                    className="flex items-center justify-center w-9 h-9 rounded-full bg-[#22B2A8] text-white hover:bg-[#1a9d8f] transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Company details and copyright */}
        <div className="border-t border-gray-200">
            <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
                <p>
                    <span className="font-semibold text-gray-700">Veritas Pathways Ltd</span> · UKPRN: 10098770,
                    Company No. 14099365
                </p>
                <p>© {new Date().getFullYear()} Veritas Pathways. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
