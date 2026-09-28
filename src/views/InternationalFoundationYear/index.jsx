import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Award, BookOpen, CalendarDays, CheckCircle2, ChevronDown, Clock, GraduationCap, MapPin, School } from 'lucide-react';
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
    { label: 'Tuition fee', value: 'Varies by Study Centre. Contact us for fees at your chosen centre.' },
    { label: 'Start dates', value: 'Multiple intakes throughout the year' },
    { label: 'Duration', value: 'Typically 9 months, full-time (6-month and 2-year options at some Study Centres)' },
    { label: 'Entry requirements', value: 'Completed high school and English at IELTS 5.0 or equivalent', href: '#entry-requirements' },
];

// Programme facts, requirements and FAQs below are taken from NCUK's
// International Foundation Year page:
// https://www.ncuk.ac.uk/ncuk-programmes/international-foundation-year/
const NCUK_LINKS = {
    preSessional: 'https://www.ncuk.ac.uk/ncuk-programmes/pre-sessional-english-for-international-foundation-year/',
    medicine: 'https://www.ncuk.ac.uk/study-medicine/',
};

// NCUK words the first point as "Guaranteed* entry"; reworded to match
// Veritas Pathways' own statement that admission is not guaranteed.
const keyBenefits = [
    'Progress to one of 80+ Veritas Pathways university partners worldwide, subject to meeting entry requirements',
    'Get support throughout the entire university application process',
    'Choose from thousands of degree courses in the UK, Australia, New Zealand, the USA, Canada and more',
    'English for Academic Purposes improves your reading, writing, speaking and listening, and is accepted by universities in lieu of IELTS',
    'Study the modules that lead to your preferred degree subject',
    'Learn from highly qualified teachers in small classes',
    'Complete the programme in as little as 9 months',
    'Flexible study options across a global network of Study Centres',
];

// Closing call to action.
const journeySteps = [
    {
        icon: MapPin,
        title: 'Choose your Study Centre',
        text: 'Study close to home or in the UK, Ireland and Europe at one of 135+ centres.',
    },
    {
        icon: BookOpen,
        title: 'Build your skills',
        text: 'Three subject modules plus academic English and study skills, in as little as 9 months.',
    },
    {
        icon: School,
        title: 'Progress to university',
        text: 'Apply to 80+ partner universities with support from our admissions team.',
    },
    {
        icon: Award,
        title: 'Graduate with confidence',
        text: 'Earn an internationally recognised degree, ready for your career.',
    },
];

const ctaFacts = [
    { value: '80+', label: 'University partners' },
    { value: '135+', label: 'Study Centres' },
    { value: '9', label: 'Months, typically' },
];

// Written in Veritas Pathways' voice; no NCUK references here.
const faqs = [
    {
        question: 'Where can I study the International Foundation Year?',
        answer: 'Veritas Pathways offers the programme through 135+ Study Centres worldwide, so you can study locally at a centre near you, or in the UK, Ireland and Europe.',
    },
    {
        question: 'What universities can I progress to?',
        answer: 'After successfully completing the programme you can progress to 80+ Veritas Pathways university partners in the UK, Australia, New Zealand, the USA, Canada and more, subject to meeting each university’s entry requirements.',
    },
    {
        question: 'How much does it cost?',
        answer: 'Tuition fees vary depending on where you choose to study. Contact us for the fees at your chosen Study Centre.',
    },
    {
        question: 'How long does it take?',
        answer: 'Typically 9 months, but shorter (6 months) and longer (2 years) options are available at some Study Centres.',
    },
    {
        question: 'Which universities recognise the International Foundation Year?',
        answer: 'All 80+ Veritas Pathways university partners recognise it. Universities outside our partner network may also recognise it, but progression to a non-partner university cannot be guaranteed.',
    },
    {
        question: 'What will I receive when I complete it?',
        answer: 'A certificate confirming that you have successfully completed the programme, and a transcript detailing your module results.',
    },
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
                            href="/application"
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
                                    Delivered through NCUK&apos;s global network of Study Centres, the programme builds
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

            {/* Who it's for and key benefits. */}
            <section className="py-16 lg:py-20 bg-[#d3efed]/35">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        <div>
                            <SectionTitle align="left">Who is it for?</SectionTitle>
                            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    Designed for international students, the International Foundation Year builds
                                    the confidence to thrive at an international university, with a solid
                                    foundation in English language and the academic study skills that higher
                                    education demands.
                                </p>
                                <p>
                                    You can start your journey locally, at a Study Centre in or near your home
                                    country, or study in the UK, and then move straight into the first year of an
                                    undergraduate degree.
                                </p>
                               
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-[#1b1b1b]">Key benefits</h3>
                            <ul className="mt-5 space-y-3.5">
                                {keyBenefits.map((benefit) => (
                                    <li key={benefit} className="flex gap-3 text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#1a9d8f]" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
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
                        Year, with progression to 6,000+ degree courses at 80+ university partners worldwide,
                        including:
                    </p>

                    <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {partnerLogos.map((partner) => (
                            <div
                                key={partner.name}
                                className="bg-white rounded-xl px-5 py-4 h-32 lg:h-36 flex items-center justify-center shadow-sm"
                            >
                                <Image
                                    src={partner.image}
                                    alt={partner.name}
                                    sizes="(min-width: 1024px) 240px, 45vw"
                                    className="max-h-full w-auto max-w-full object-contain"
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
                                <dd className="sm:col-span-2 text-gray-600">
                                    {row.href ? (
                                        <a href={row.href} className="hover:underline">
                                            {row.value}
                                            <span className="ml-1 font-semibold text-[#1a9d8f]">See details</span>
                                        </a>
                                    ) : (
                                        row.value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-center text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        The programme also provides pathways into related undergraduate degrees such as Business,
                        Computer Science, Engineering, Social Sciences and Pharmacy-related subjects, subject to
                        meeting entry requirements.
                    </p>
                </div>
            </section>

            {/* Entry requirements. Linked to from Key information. */}
            <section id="entry-requirements" className="scroll-mt-32 py-16 lg:py-20 bg-[#f1f1f1]">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionTitle>Entry requirements</SectionTitle>
                    <p className="mt-5 text-center text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        To be accepted onto the International Foundation Year, you must meet the minimum entry
                        criteria below.
                    </p>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div className="bg-white rounded-xl p-8">
                            <h3 className="text-xl font-bold text-[#1b1b1b]">Academic requirements</h3>
                            <ul className="mt-5 space-y-3 text-gray-700">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#1a9d8f]" />
                                    Completion of local high school
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#1a9d8f]" />
                                    Completion of IGCSE / O Levels / GCSEs with 4 modules at grade 4 or above,
                                    normally including English and Maths
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-8">
                            <h3 className="text-xl font-bold text-[#1b1b1b]">English language requirements</h3>
                            <ul className="mt-5 space-y-3 text-gray-700">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#1a9d8f]" />
                                    English language ability at IELTS 5.0 or equivalent before entry
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#1a9d8f]" />
                                    For Study Centres in the UK, a UKVI IELTS test is needed for visa purposes
                                </li>
                            </ul>
                         
                        </div>
                    </div>
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
                            <p className="mt-2 text-sm text-gray-500">
                                Choose three of the twelve below. Available modules vary by Study Centre.
                            </p>
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
                    <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-5 items-center">
                        {accreditationLogos.map((logo) => (
                            <div
                                key={logo.name}
                                className="bg-white rounded-xl px-5 py-4 h-32 lg:h-36 flex items-center justify-center border border-gray-100"
                            >
                                <Image
                                    src={logo.image}
                                    alt={logo.name}
                                    sizes="(min-width: 1024px) 240px, 45vw"
                                    className="max-h-full w-auto max-w-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs. <details> needs no JavaScript and keeps every answer in the HTML. */}
            {/* id="faq" is the target of the navbar's FAQ link (/#faq). */}
            <section id="faq" className="scroll-mt-32 py-16 lg:py-20 bg-[#f1f1f1]">
                <div className="container mx-auto px-4 max-w-7xl">
                    <SectionTitle>Frequently asked questions</SectionTitle>
                    <div className="mt-12 max-w-3xl mx-auto space-y-3">
                        {faqs.map((faq) => (
                            <details key={faq.question} className="group bg-white rounded-xl border border-gray-200">
                                <summary className="flex items-center justify-between gap-4 px-6 py-5 font-semibold text-[#1b1b1b] list-none [&::-webkit-details-marker]:hidden">
                                    {faq.question}
                                    <ChevronDown className="w-5 h-5 shrink-0 text-[#1a9d8f] transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="px-6 pb-5 -mt-1 text-gray-600 leading-relaxed">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing call to action. */}
            <section className="relative overflow-hidden bg-linear-to-br from-[#1a9d8f] via-[#168f83] to-[#0f6f66] text-white">
                {/* Decorative shapes only. */}
                <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-20 w-[24rem] h-[24rem] rounded-full bg-[#22b2a8]/40 blur-3xl" />

                <div className="relative container mx-auto px-4 max-w-7xl py-20 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
                        <div>
                            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-semibold">
                                <GraduationCap className="w-4 h-4" />
                                Your pathway to university
                            </p>
                            <h2 className="mt-5 text-4xl sm:text-5xl leading-[1.1] font-bold">
                                Get to where you want to be
                            </h2>
                            <p className="mt-5 text-lg text-white/85 leading-relaxed max-w-lg">
                                Start your journey to a world-class university with the International Foundation
                                Year. Our admissions team will guide you from application to your first day.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/application"
                                    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#14726e] font-bold shadow-lg shadow-black/10 hover:bg-[#eefbfa] transition-colors"
                                >
                                    Apply now
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-full border-2 border-white/70 text-white font-semibold hover:bg-white hover:text-[#14726e] transition-colors"
                                >
                                    Talk to our team
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <dl className="mt-10 pt-8 border-t border-white/20 grid grid-cols-3 gap-4 max-w-md">
                                {ctaFacts.map((fact) => (
                                    <div key={fact.label}>
                                        <dt className="sr-only">{fact.label}</dt>
                                        <dd className="text-2xl sm:text-3xl font-bold">{fact.value}</dd>
                                        <dd className="mt-1 text-sm text-white/75 leading-snug">{fact.label}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Steps as a connected timeline. */}
                        <ol className="relative rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 p-6 sm:p-8">
                            {journeySteps.map((step, index) => {
                                const Icon = step.icon;
                                const isLast = index === journeySteps.length - 1;
                                return (
                                    <li key={step.title} className={`relative flex gap-5 ${isLast ? '' : 'pb-8'}`}>
                                        {!isLast && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute left-6 top-14 bottom-2 w-px bg-white/30"
                                            />
                                        )}
                                        <span className="relative flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-white text-[#14726e] shadow-md">
                                            <Icon className="w-5 h-5" />
                                            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-[#0f6f66] text-white text-[11px] font-bold ring-2 ring-white">
                                                {index + 1}
                                            </span>
                                        </span>
                                        <div className="pt-1">
                                            <h3 className="text-lg font-bold leading-snug">{step.title}</h3>
                                            <p className="mt-1 text-white/80 leading-relaxed">{step.text}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InternationalFoundationYear;
