import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Clock, GraduationCap, MapPin } from 'lucide-react';
import heroImage from '../../assets/ify/hero.jpg';
import overviewImage from '../../assets/ify/overview.webp';
import { subjectTiles } from './subjectTiles';
import { partnerLogos, accreditationLogos } from './partnerLogos';

// Brand values sampled from the live site rather than guessed.
const BRAND = '#1a9d8f';

const heroFacts = [
    { icon: MapPin, label: 'Location', value: '135+ Global Study Centres' },
    { icon: GraduationCap, label: 'University Partners', value: '80+ worldwide' },
    { icon: CalendarDays, label: 'Start dates', value: 'Multiple intakes yearly' },
    { icon: Clock, label: 'Duration', value: 'From 9 months' },
];

const keyInformation = [
    { label: 'Location', value: '135+ Global Study Centres (incl. UK, Ireland & Europe)' },
    { label: 'Tuition fee', value: 'Varies by Study Centre — contact us for fees at your chosen centre' },
    { label: 'Start dates', value: 'Multiple intakes throughout the year' },
    { label: 'Duration', value: 'As little as 9 months, full-time' },
];

const SectionTitle = ({ children, align = 'center' }) => (
    <h2
        className={`font-nunito text-3xl sm:text-[40px] leading-tight font-bold text-[#1b1b1b] ${
            align === 'center' ? 'text-center' : ''
        }`}
    >
        {children}
    </h2>
);

const InternationalFoundationYear = () => {
    return (
        <div className="font-nunito bg-white text-[#1b1b1b]">
            {/* Hero: photographic background with a dark overlay, matching the live page. */}
            <section className="relative">
                <div className="relative">
                    {/* The largest thing above the fold, so it loads first. */}
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
                    <div className="relative container mx-auto px-4 max-w-7xl pt-24 pb-44 lg:pt-32 lg:pb-52">
                        <p className="text-white/90 text-sm sm:text-base font-semibold">
                            Pathway to Undergraduate Degrees Worldwide
                        </p>
                        <h1 className="mt-4 text-white font-bold leading-[1.1] text-4xl sm:text-5xl lg:text-[52px] max-w-2xl">
                            International Foundation Year
                        </h1>
                        <p className="mt-4 text-white/85 text-sm sm:text-base">
                            (Delivered in partnership with NCUK – University Pathways)
                        </p>
                        <Link
                            href="/application-process"
                            className="mt-8 inline-flex items-center justify-center px-8 py-3 rounded-full text-white font-semibold transition hover:opacity-90"
                            style={{ backgroundColor: BRAND }}
                        >
                            Apply now
                        </Link>
                    </div>
                </div>

                {/* Floating stats card overlapping the hero. */}
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="relative -mt-28 lg:-mt-24 bg-white rounded-xl shadow-[0_18px_50px_rgba(0,0,0,0.10)] px-6 py-8 lg:px-10">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {heroFacts.map((fact) => {
                                const Icon = fact.icon;
                                return (
                                    <div key={fact.label} className="flex items-start gap-3">
                                        <Icon className="w-5 h-5 mt-1 shrink-0" style={{ color: BRAND }} />
                                        <div>
                                            <dt className="text-sm text-gray-500">{fact.label}</dt>
                                            <dd className="mt-1 font-semibold text-[#1b1b1b]">{fact.value}</dd>
                                        </div>
                                    </div>
                                );
                            })}
                        </dl>
                    </div>
                </div>
            </section>

            {/* Course overview: text left, photo right. */}
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div>
                            <SectionTitle align="left">Course overview</SectionTitle>
                            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    The International Foundation Year, delivered in partnership with NCUK, prepares
                                    international students for first-year entry onto undergraduate degrees at leading
                                    universities in the UK, Australia, New Zealand, the USA, Canada and more.
                                </p>
                                <p>
                                    Delivered through NCUK&apos;s Global Network of Study Centres, the programme builds
                                    subject knowledge, academic study skills and English language competency,
                                    benchmarked by Ecctis as comparable to GCE A Level, HKDSE, US Advanced Placement,
                                    Australian Senior Secondary and Alberta High School Diploma standards.
                                </p>
                                <p>
                                    Students choose three academic subject modules from 12 available options, alongside
                                    an English for Academic Purposes module and an online Skills for Success module,
                                    giving flexibility to progress into the degree subject that&apos;s right for them.
                                </p>
                            </div>
                            <Link
                                href="/contact"
                                className="mt-6 inline-flex items-center gap-1.5 font-semibold hover:underline"
                                style={{ color: BRAND }}
                            >
                                Contact us to learn more
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div>
                            <Image
                                src={overviewImage}
                                alt="Students studying together"
                                placeholder="blur"
                                sizes="(min-width: 1024px) 50vw, 100vw"
                                className="w-full h-auto rounded-xl object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Degree pathway: photographic subject tiles. */}
            <section className="py-16 lg:py-20 bg-[#f1f1f1]">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionTitle>
                        Which degree programme can I study after completing this foundation?
                    </SectionTitle>
                    <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {subjectTiles.map((subject) => (
                            <figure
                                key={subject.name}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                <Image
                                    src={subject.image}
                                    alt={subject.name}
                                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                                    className="w-full h-36 object-cover"
                                />
                                <figcaption className="px-4 py-4 text-center font-semibold text-[#1b1b1b]">
                                    {subject.name}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner universities. */}
            <section className="py-16 lg:py-20 bg-[#eef9f8]/60">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionTitle>Where can I study these programmes?</SectionTitle>
                    <p className="mt-5 text-center text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Veritas Pathways is proud to partner with NCUK in delivering the International Foundation
                        Year, with progression to 80+ university partners worldwide, including:
                    </p>

                    <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {partnerLogos.map((partner) => (
                            <div
                                key={partner.name}
                                className="bg-white rounded-xl p-6 h-28 flex items-center justify-center shadow-sm"
                            >
                                <Image
                                    src={partner.image}
                                    alt={partner.name}
                                    sizes="200px"
                                    className="max-h-14 w-auto max-w-full object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    <p className="mt-10 text-sm text-gray-500 leading-relaxed max-w-4xl mx-auto text-center">
                        Progression to partner universities is subject to students meeting the academic, English
                        language, attendance and non-academic entry requirements of each receiving institution.
                        Veritas Pathways does not guarantee admission.
                    </p>

                    <div className="mt-8 text-center">
                        <Link
                            href="/university-progression"
                            className="inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold border-2 border-[#1a9d8f] text-[#1a9d8f] transition hover:bg-[#1a9d8f] hover:text-white"
                        >
                            View all partner universities
                        </Link>
                    </div>
                </div>
            </section>

            {/* Key information. */}
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionTitle>Key information</SectionTitle>
                    <div className="mt-12 max-w-4xl mx-auto divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                        {keyInformation.map((row) => (
                            <div key={row.label} className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-6 py-5">
                                <dt className="font-semibold text-[#1b1b1b]">{row.label}</dt>
                                <dd className="sm:col-span-2 text-gray-600">{row.value}</dd>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-center text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        The programme also provides pathways into related undergraduate degrees such as Business,
                        Computer Science, Engineering, Social Sciences and Pharmacy-related subjects, subject to
                        meeting entry requirements.{' '}
                        <Link href="/entry-requirements" className="font-semibold hover:underline" style={{ color: BRAND }}>
                            Entry requirements
                        </Link>
                    </p>
                </div>
            </section>

            {/* What you'll study. */}
            <section className="py-16 lg:py-20 bg-[#d3efed]/35">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionTitle>What you&apos;ll study</SectionTitle>
                    <p className="mt-5 text-center text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Explore a carefully designed curriculum that builds your foundation in your chosen subjects
                        and academic English, essential for success in your undergraduate degree.
                    </p>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                        <div className="bg-white rounded-xl p-8">
                            <h3 className="text-xl font-bold text-[#1b1b1b]">English skills modules</h3>
                            <ul className="mt-5 space-y-3 text-gray-600">
                                <li className="flex gap-2">
                                    <span style={{ color: BRAND }}>•</span>
                                    English for Academic Purposes
                                </li>
                                <li className="flex gap-2">
                                    <span style={{ color: BRAND }}>•</span>
                                    Skills for Success
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-8">
                            <h3 className="text-xl font-bold text-[#1b1b1b]">Academic subject modules</h3>
                            <p className="mt-2 text-sm text-gray-500">Choose three of the twelve below.</p>
                            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-600">
                                {subjectTiles.map((subject) => (
                                    <li key={subject.name} className="flex gap-2">
                                        <span style={{ color: BRAND }}>•</span>
                                        {subject.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accreditations. */}
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionTitle>Our accreditations</SectionTitle>
                    <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
                        {accreditationLogos.map((logo) => (
                            <div
                                key={logo.name}
                                className="bg-white rounded-xl p-6 h-28 flex items-center justify-center border border-gray-100"
                            >
                                <Image
                                    src={logo.image}
                                    alt={logo.name}
                                    sizes="200px"
                                    className="max-h-16 w-auto max-w-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InternationalFoundationYear;
