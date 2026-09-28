// Shared layout and typography for the legal pages (privacy policy, terms of
// use). Server components only: these pages have no interactivity.

export const LegalPage = ({ title, intro, children }) => (
    <div className="font-nunito bg-white text-[#1b1b1b]">
        <header className="bg-[#d3efed]/35 border-b border-gray-200">
            <div className="container mx-auto px-4 py-14 lg:py-16">
                <h1 className="text-3xl sm:text-[40px] leading-tight font-bold">{title}</h1>
                {intro && <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">{intro}</p>}
            </div>
        </header>
        <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-3xl">{children}</div>
        </div>
    </div>
);

// In-page links to each section; the live site shows these as tabs.
export const LegalContents = ({ items }) => (
    <nav aria-label="On this page" className="mb-12 rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">On this page</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {items.map((item) => (
                <li key={item.id}>
                    <a href={`#${item.id}`} className="font-semibold text-[#1a9d8f] hover:underline">
                        {item.label}
                    </a>
                </li>
            ))}
        </ul>
    </nav>
);

// scroll-mt clears the sticky navbar when jumping to a section.
export const LegalSection = ({ id, title, children }) => (
    <section id={id} className="scroll-mt-32 mb-14 last:mb-0">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">{title}</h2>
        <div className="space-y-6">{children}</div>
    </section>
);

export const LegalBlock = ({ title, children }) => (
    <div>
        {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
        <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </div>
);

export const LegalList = ({ items }) => (
    <ul className="list-disc pl-5 space-y-2">
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ul>
);

export const LegalLink = ({ href, children }) => (
    <a
        href={href}
        className="font-semibold text-[#1a9d8f] underline underline-offset-2 hover:text-[#158e88]"
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
        {children}
    </a>
);
