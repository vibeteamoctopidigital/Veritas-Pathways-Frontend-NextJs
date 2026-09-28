'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { baseAPI } from '../../config/api';
import CourseDetailsModal from './components/courseDetails';
import CourseCard from './components/CourseCard';
import { formatCountryName } from '../../utils/formatName';

const EMPTY_PAGINATION = { total: 0, page: 1, limit: 10, totalPages: 0 };

// The initial* props come from the server (app/(site)/university-progression),
// so the first page of results is in the HTML. Filtering and paging then fetch
// on the client as before. Each prop is null when the server fetch failed, in
// which case the client loads that data itself.
const Course = ({
    initialCourses = null,
    initialPagination = null,
    initialUniversities = null,
    initialProgrammes = null,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedUniversities, setSelectedUniversities] = useState([]);
    const [isCountryOpen, setIsCountryOpen] = useState(true);
    const [isUniversityOpen, setIsUniversityOpen] = useState(false);
    const [isProgrammeOpen, setIsProgrammeOpen] = useState(true);
    const [programmes, setProgrammes] = useState(initialProgrammes ?? []);
    const [selectedProgramme, setSelectedProgramme] = useState('');
    const [courses, setCourses] = useState(initialCourses ?? []);
    const [loading, setLoading] = useState(!initialCourses);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState(initialPagination ?? EMPTY_PAGINATION);
    const [currentPage, setCurrentPage] = useState(1);
    // Type-ahead within each filter panel. These narrow the visible options
    // only; they do not filter the course results themselves.
    const [universityFilter, setUniversityFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const resultsRef = useRef(null);
    const isFirstRender = useRef(true);
    const [universities, setUniversities] = useState(initialUniversities ?? []);
    // True while the results on screen are still the server-rendered first page.
    const hasServerCourses = useRef(Boolean(initialCourses));
    // Mobile only: the filters live in a bottom sheet instead of stacking above
    // the results. On lg and up they are always shown in the sidebar.
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        if (!isFiltersOpen) return undefined;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (e) => e.key === 'Escape' && setIsFiltersOpen(false);
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isFiltersOpen]);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await baseAPI.course.getUniversities({ limit: 1000 });
                const data = response?.data?.data;
                setUniversities(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching universities:', error);
            }
        };
        if (!initialUniversities) fetchUniversities();

        const fetchProgrammes = async () => {
            try {
                const response = await baseAPI.course.getProgrammes();
                setProgrammes(Array.isArray(response?.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching programmes:', error);
            }
        };
        if (!initialProgrammes) fetchProgrammes();
    }, [initialUniversities, initialProgrammes]);

    useEffect(() => {
        // The server already rendered page 1 with no filters; don't fetch it again.
        if (hasServerCourses.current) {
            hasServerCourses.current = false;
            return;
        }

        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: 10,
                    group: true,
                };
                if (searchQuery) params.search = searchQuery;
                if (selectedCountries.length > 0) params.country = selectedCountries[0];
                if (selectedUniversities.length > 0) params.university = selectedUniversities[0];
                if (selectedProgramme) params.programType = selectedProgramme;

                const response = await baseAPI.course.getAllCourse(params);
                setCourses(Array.isArray(response?.data?.data) ? response.data.data : []);
                setPagination(response?.data?.pagination || EMPTY_PAGINATION);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [searchQuery, selectedCountries, selectedUniversities, selectedProgramme, currentPage]);

    // Paging from the controls at the bottom would otherwise leave the viewport
    // at the end of the new page, so return to the top of the results.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const container = resultsRef.current;
        if (!container) return;

        const NAVBAR_OFFSET = 116; // Height of the sticky navbar.
        const top = container.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, [currentPage]);




    // Options shown in each panel, narrowed by that panel's search box. A
    // selected option always stays visible so it can be unticked.
    const visibleUniversities = universities.filter(
        (uni) =>
            selectedUniversities.includes(uni.name) ||
            uni.name?.toLowerCase().includes(universityFilter.trim().toLowerCase()),
    );

    const allCountries = [...new Set(universities.map((uni) => uni.country?.name).filter(Boolean))];
    const visibleCountries = allCountries.filter(
        (country) =>
            selectedCountries.includes(country) ||
            formatCountryName(country).toLowerCase().includes(countryFilter.trim().toLowerCase()),
    );

    const toggleCountry = (countryCode) => {
        if (countryCode === 'all') {
            setSelectedCountries([]);
        } else {
            // Clicking the checked country clears it, the same way universities behave.
            setSelectedCountries(prev =>
                prev.includes(countryCode) ? [] : [countryCode]
            );
        }
        setCurrentPage(1);
    };

    const toggleProgramme = (name) => {
        setSelectedProgramme((prev) => (prev === name ? '' : name));
        setCurrentPage(1);
    };

    const toggleUniversity = (universityName) => {
        setSelectedUniversities(prev =>
            prev.includes(universityName) ? [] : [universityName]
        );
        setCurrentPage(1);
    };

    const activeFilterCount =
        selectedCountries.length + selectedUniversities.length + (selectedProgramme ? 1 : 0);

    const clearFilters = () => {
        setSelectedCountries([]);
        setSelectedUniversities([]);
        setSelectedProgramme('');
        setCurrentPage(1);
    };




    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-[28px] leading-tight sm:text-4xl font-bold text-gray-900 text-center mb-4">
                        Progression Opportunities in the UK and Beyond
                    </h1>
                    <p className="text-center text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Veritas Pathways partners with universities that value strong academic preparation and
                        international student success. Our progression network includes institutions offering recognised
                        degrees across key subject areas such as business, health sciences, engineering, computing, and
                        social sciences.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                    {/* Sidebar Filters. Below lg this is a bottom sheet opened from
                        the Filters button; from lg up it is a plain sidebar. */}
                    <div
                        className={`${isFiltersOpen ? 'fixed' : 'hidden'} inset-0 z-50 bg-black/40 lg:static lg:block lg:z-auto lg:bg-transparent`}
                        onClick={() => setIsFiltersOpen(false)}
                    >
                    <aside
                        className="absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col bg-white rounded-t-2xl shadow-2xl lg:static lg:max-h-none lg:rounded-none lg:shadow-none"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Course filters"
                    >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 lg:hidden">
                        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                        <div className="flex items-center gap-4">
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="text-sm font-semibold text-teal-600">
                                    Clear all
                                </button>
                            )}
                            <button onClick={() => setIsFiltersOpen(false)} aria-label="Close filters" className="text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 lg:p-0 lg:overflow-visible">

                            {/* By University */}
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                            <button
                                onClick={() => setIsUniversityOpen(!isUniversityOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <span>By University</span>
                                <ChevronDown className={`w-5 h-5 transition-transform ${isUniversityOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isUniversityOpen && (
                                <div className="p-4 pt-3">
                                    <div className="relative mb-2">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={universityFilter}
                                            onChange={(e) => setUniversityFilter(e.target.value)}
                                            placeholder="Search universities..."
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto thin-scrollbar">
                                        {visibleUniversities.length > 0 ? visibleUniversities.map(uni => (
                                            <label
                                                key={uni._id}
                                                className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUniversities.includes(uni.name)}
                                                    onChange={() => toggleUniversity(uni.name)}
                                                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="text-sm capitalize">{uni.name}</span>
                                            </label>
                                        )) : (
                                            <p className="px-2 py-3 text-sm text-gray-500">No universities match.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* By Country */}
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                            <button
                                onClick={() => setIsCountryOpen(!isCountryOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <span>By Country</span>
                                <ChevronDown className={`w-5 h-5 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isCountryOpen && (
                                <div className="p-4 pt-3">
                                    <div className="relative mb-2">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={countryFilter}
                                            onChange={(e) => setCountryFilter(e.target.value)}
                                            placeholder="Search countries..."
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto thin-scrollbar">
                                        {visibleCountries.length > 0 ? visibleCountries.map(country => (
                                            <label
                                                key={country}
                                                className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCountries.includes(country)}
                                                    onChange={() => toggleCountry(country)}
                                                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="text-sm">{formatCountryName(country)}</span>
                                            </label>
                                        )) : (
                                            <p className="px-2 py-3 text-sm text-gray-500">No countries match.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    

                        {/* By Programme */}
                        {programmes.length > 0 && (
                            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                <button
                                    onClick={() => setIsProgrammeOpen(!isProgrammeOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <span>By Programme</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform ${isProgrammeOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isProgrammeOpen && (
                                    <div className="p-4 pt-3 space-y-2 max-h-72 overflow-y-auto thin-scrollbar">
                                        {programmes.map((programme) => (
                                            <label
                                                key={programme.name}
                                                className="flex items-start gap-3 text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProgramme === programme.name}
                                                    onChange={() => toggleProgramme(programme.name)}
                                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="text-sm flex-1">{programme.name}</span>
                                                <span className="text-xs text-gray-400">{programme.count}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200 lg:hidden">
                        <button
                            onClick={() => setIsFiltersOpen(false)}
                            className="w-full py-3 rounded-lg bg-[#1BA39C] text-white font-semibold hover:bg-[#169488] transition-colors"
                        >
                            Show {pagination.total.toLocaleString('en-GB')} {pagination.total === 1 ? 'result' : 'results'}
                        </button>
                    </div>
                    </aside>
                    </div>

                    {/* Main Content. Deliberately not its own scroll container: capping
                        the height here produced a second scrollbar alongside the page's. */}
                    <div ref={resultsRef}>
                        {/* Search Bar */}
                        {/* top-29 (116px) clears the sticky navbar: info bar + main bar. */}
                        <div className="sticky top-29 z-20 bg-white pt-3 pb-4 mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-gray-100 ">
                            <div className="text-sm text-gray-600 w-full sm:w-auto order-2 sm:order-none">
                                Your search has returned <span className="font-bold text-teal-600">{pagination.total.toLocaleString('en-GB')}</span> {pagination.total === 1 ? 'result' : 'results'}.
                            </div>
                            <div className="flex flex-1 sm:flex-none items-center gap-2 sm:w-80">
                            <button
                                onClick={() => setIsFiltersOpen(true)}
                                className="lg:hidden shrink-0 inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1BA39C] text-white text-xs">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search subjects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white relative z-30"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-40" />
                            </div>
                            </div>
                        </div>

                        {/* Course Cards Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                                        <div className="relative bg-white p-6 pb-2">
                                            <div className="absolute top-4 left-4 h-4 w-20 bg-gray-200 rounded"></div>
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-gray-200 rounded-full"></div>
                                            <div className="flex flex-col items-center pt-8 pb-3">
                                                <div className="w-16 h-16 bg-gray-200 rounded mb-3"></div>
                                                <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-gray-100"></div>
                                        <div className="p-6 pt-4">
                                            <div className="h-4 w-48 bg-gray-200 rounded mb-3"></div>
                                            <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
                                            <div className="h-16 w-full bg-gray-200 rounded mb-4"></div>
                                            <div className="grid grid-cols-2 gap-6 mb-5">
                                                <div>
                                                    <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                                                </div>
                                                <div>
                                                    <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                                                <div className="w-10 h-7 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {courses.map((course) => (
                                    <CourseCard
                                        key={course._id}
                                        course={course}
                                        onViewDetails={(selected) => {
                                            setSelectedCourse(selected);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {courses.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No courses found matching your criteria.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Course Details Modal */}
            <CourseDetailsModal
                course={selectedCourse}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCourse(null);
                }}
            />
        </div>
    );
};

export default Course;