'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../assets/Logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUniversityOpen, setIsUniversityOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        {
            name: "University Progression",
            path: "/university-progression",

        },
        { name: "Application Process", path: "/application-process" },
    
        { name: "FAQ", path: "/faq" },
    ];

    return (
        <nav className="w-full z-50 sticky top-0 shadow-sm">
            {/* Top Info Bar */}
            <div className="bg-[#1BA39C] text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-9 text-sm">
                        {/* Left Side - Links */}
                        <div className="flex items-center gap-6">
                            <Link href="/privacy-policy" className="hover:opacity-80 transition">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-use" className="hover:opacity-80 transition">
                                Terms of Use
                            </Link>
                        </div>

                        {/* Right Side - Contact Info */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="mailto:info@veritaspathways.co.uk" className="flex items-center gap-2 hover:opacity-80 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                info@veritaspathways.co.uk
                            </a>
                            <a href="tel:+442033559930" className="flex items-center gap-2 hover:opacity-80 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                +442033559930
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 hover:opacity-80 transition"
                        >
                            
                            <Image className="w-[150px] h-[42px]" src={logo} alt="Veritas Pathways" priority />
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                link.hasDropdown ? (
                                    <div
                                        key={link.name}
                                        className="relative"
                                        onMouseEnter={() => {
                                            if (link.name === "University Progression") {
                                                setIsUniversityOpen(true);
                                            } else if (link.name === "About") {
                                                setIsAboutOpen(true);
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (link.name === "University Progression") {
                                                setIsUniversityOpen(false);
                                            } else if (link.name === "About") {
                                                setIsAboutOpen(false);
                                            }
                                        }}
                                    >
                                        <Link
                                            href={link.path}
                                            className="flex items-center gap-1 text-gray-700 hover:text-[#1BA39C] transition font-medium"
                                            style={{
                                                color: pathname === link.path ? '#1BA39C' : '',
                                            }}
                                        >
                                            {link.name}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </Link>
                                        <AnimatePresence>
                                            {((link.name === "University Progression" && isUniversityOpen) ||
                                                (link.name === "About" && isAboutOpen)) && (
                                                    <motion.div
                                                        className="absolute top-full left-0 pt-2 w-56 z-50"
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="bg-white shadow-lg rounded-md py-2 border border-gray-100">
                                                            {link.name === "University Progression" && (
                                                                <>
                                                                    <Link
                                                                        href="/university-progression/undergraduate"
                                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                                                    >
                                                                        Undergraduate Programs
                                                                    </Link>
                                                                    <Link
                                                                        href="/university-progression/postgraduate"
                                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                                                    >
                                                                        Postgraduate Programs
                                                                    </Link>
                                                                </>
                                                            )}
                                                            {link.name === "About" && (
                                                                <>
                                                                    <Link
                                                                        href="/about/our-story"
                                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                                                    >
                                                                        Our Story
                                                                    </Link>
                                                                    <Link
                                                                        href="/about/team"
                                                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                                                    >
                                                                        Our Team
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className="text-gray-700 hover:text-[#1BA39C] transition font-medium"
                                        style={{
                                            color: pathname === link.path ? '#1BA39C' : '',
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Desktop Contact Button */}
                        <div className="hidden lg:block">
                            <Link href="/contact">
                                <button className="px-6 py-2 border-2 border-[#1BA39C] text-[#1BA39C] rounded-full hover:bg-[#1BA39C] hover:text-white transition font-medium">
                                    Contact Us
                                </button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-6 gap-4 z-40"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {navLinks.map((link) => (
                            link.hasDropdown ? (
                                <div key={link.name}>
                                    <button
                                        onClick={() => {
                                            if (link.name === "University Progression") {
                                                setIsUniversityOpen(!isUniversityOpen);
                                            } else if (link.name === "About") {
                                                setIsAboutOpen(!isAboutOpen);
                                            }
                                        }}
                                        className="text-lg hover:text-[#1BA39C] transition w-full text-left flex items-center gap-1 text-gray-700 font-medium"
                                    >
                                        {link.name}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                    <AnimatePresence>
                                        {((link.name === "University Progression" && isUniversityOpen) ||
                                            (link.name === "About" && isAboutOpen)) && (
                                                <motion.div
                                                    className="pl-4 mt-2 flex flex-col gap-2"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {link.name === "University Progression" && (
                                                        <>
                                                            <Link
                                                                href="/university-progression/undergraduate"
                                                                className="text-gray-600 hover:text-[#1BA39C] transition"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                Undergraduate Programs
                                                            </Link>
                                                            <Link
                                                                href="/university-progression/postgraduate"
                                                                className="text-gray-600 hover:text-[#1BA39C] transition"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                Postgraduate Programs
                                                            </Link>
                                                        </>
                                                    )}
                                                    {link.name === "About" && (
                                                        <>
                                                            <Link
                                                                href="/about/our-story"
                                                                className="text-gray-600 hover:text-[#1BA39C] transition"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                Our Story
                                                            </Link>
                                                            <Link
                                                                href="/about/team"
                                                                className="text-gray-600 hover:text-[#1BA39C] transition"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                Our Team
                                                            </Link>
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="text-lg hover:text-[#1BA39C] transition text-gray-700 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}

                        {/* Mobile Contact Info */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                            <a href="mailto:info@veritaspathways.co.uk" className="flex items-center gap-2 text-gray-600 hover:text-[#1BA39C] transition text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                info@veritaspathways.co.uk
                            </a>
                            <a href="tel:+442033559930" className="flex items-center gap-2 text-gray-600 hover:text-[#1BA39C] transition text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                +442033559930
                            </a>
                        </div>

                        <div className="pt-2">
                            <Link href="/contact" onClick={() => setIsOpen(false)}>
                                <button className="w-full px-6 py-2 bg-[#1BA39C] text-white rounded-full hover:bg-[#169488] transition font-medium">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;