import Image from 'next/image';
import heroImage from '../../assets/application/hero.jpg';

// Copied from https://veritaspathways.co.uk/application/. The form itself is a
// separate app, embedded the same way the live page does it.
export const APPLICATION_FORM_URL = 'https://veritas-pathways.vercel.app/';

const Application = () => (
    <div className="font-nunito bg-white text-[#1b1b1b]">
        {/* Hero. The photo already has its dark gradient baked in. */}
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
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
            <div className="relative container mx-auto px-4 py-28 lg:py-40 text-center">
                <h1 className="mx-auto max-w-4xl text-white font-bold leading-[1.15] text-[28px] sm:text-5xl lg:text-[56px]">
                    Start your application journey: Foundation Programme application form
                </h1>
                <p className="mt-6 text-white/90 text-base sm:text-lg">
                    Fill out the form below and our team will get in touch to guide you through the next steps.
                </p>
            </div>
        </section>

        {/* Form */}
        <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-[40px] leading-tight font-bold">Application form</h2>
                    <p className="mt-5 mx-auto max-w-xl text-gray-600 leading-relaxed">
                        Please complete all sections of this application form. Fields marked with (*) are
                        mandatory. Our admissions team will contact you after reviewing your application.
                    </p>
                </div>

                {/* The form is on another origin, so its height can't be read to
                    size the frame; this fits the longest steps, and anything
                    beyond scrolls inside the frame. */}
                <div className="mt-12 mx-auto max-w-4xl">
                    <iframe
                        src={APPLICATION_FORM_URL}
                        title="Foundation Programme application form"
                        className="block w-full h-[1300px] sm:h-[1100px] border-0"
                        allowFullScreen
                    />
            
                </div>
            </div>
        </section>
    </div>
);

export default Application;
