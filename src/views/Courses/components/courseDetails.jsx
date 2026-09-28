import React from 'react';
import { X, Info, Globe, Award, ClipboardList, CalendarDays, Layers, ExternalLink } from 'lucide-react';
import UniversityAvatar from '../../../components/ui/UniversityAvatar';
import { formatCountryName } from '../../../utils/formatName';
import { academicRequirements } from './courseRequirements';

// The Excel import writes "N/A" where a value was blank, so treat that as empty.
const valueOrNull = (value) => {
    if (value === null || value === undefined) return null;
    const text = String(value).trim();
    return text && text.toUpperCase() !== 'N/A' ? text : null;
};

const linkClass = 'inline-flex items-center gap-1 font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800';

const EAP_BANDS = [
    ['listening', 'Listening'],
    ['reading', 'Reading'],
    ['speaking', 'Speaking'],
    ['writing', 'Writing'],
];

const ProgrammeRequirements = ({ programme, showHeading, hasNotes }) => {
    const requirements = academicRequirements(programme);

    return (
        <section className="space-y-3">
            {showHeading && (
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Layers className="w-5 h-5 text-teal-600" />
                    {valueOrNull(programme.programType) || 'Direct entry'}
                </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* EAP Requirements */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-5 h-5 text-teal-600" />
                        <h4 className="font-bold text-gray-900">EAP Requirements</h4>
                    </div>

                    {/* Overall Score */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Overall Score</span>
                            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                                <span className={`text-white font-bold ${programme.eap?.overall ? '' : 'text-xs'}`}>{programme.eap?.overall || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                        {EAP_BANDS.map(([key, label]) => (
                            <div key={key} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{label}</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {programme.eap?.[key] || 'N/A'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Academic Requirements */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-teal-600" />
                        <h4 className="font-bold text-gray-900">Academic Requirements</h4>
                    </div>

                    {/* Which results count depends on the programme, so list
                        only the ones this programme sets. */}
                    {requirements.length > 0 ? (
                        <div className="space-y-3">
                            {requirements.map((item) => (
                                <div key={item.label} className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                                    <span className="text-xs text-gray-500 uppercase">{item.label}</span>
                                    <span className="text-xl font-bold text-gray-900 text-right">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">
                            {hasNotes ? 'See the subject requirements above.' : 'Contact us for the entry requirements for this course.'}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

const CourseDetailsModal = ({ course, isOpen, onClose }) => {
    if (!isOpen || !course) return null;

    // Grouped results carry every programme row for the course; a single row
    // (older API, or a course with one route in) is its own only programme.
    const programmes = course.programmes?.length ? course.programmes : [course];
    const programmeNames = [...new Set(programmes.map((p) => valueOrNull(p.programType)).filter(Boolean))];

    const country = valueOrNull(course.university?.country?.name);
    // Rows for the same course usually repeat the same note, so show each once.
    const notes = [...new Set(programmes.map((p) => valueOrNull(p.notes)).filter(Boolean))].join('\n\n') || null;
    const intakeYear = valueOrNull(course.intakeYear);
    const degree = valueOrNull(course.degree);
    // "2025/26" on imported courses; older rows only have an intake year.
    const entry = valueOrNull(course.version) || intakeYear;
    const courseUrl = valueOrNull(course.courseUrl);
    const universityUrl = valueOrNull(course.universityUrl);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* University Info */}
                    <div className="flex items-start gap-4 mb-4">
                        <UniversityAvatar
                            university={course?.university}
                            className="w-14 h-14"
                            textClassName="text-lg"
                        />
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 capitalize">
                                {course.university?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {country ? `Partner University · ${formatCountryName(country)}` : 'Partner University'}
                            </p>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {entry && (
                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {course.version ? `${entry} entry` : `Intake ${entry}`}
                            </span>
                        )}
                        {programmeNames.map((name) => (
                            <span key={name} className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-semibold">
                                {name}
                            </span>
                        ))}
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                course.isActive
                                    ? 'bg-teal-50 text-teal-600'
                                    : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {course.isActive ? '✓ Accepting applications' : 'Not currently available'}
                        </span>
                    </div>

                    {/* Course Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {course.subject}
                        {degree && <span className="ml-2 text-xl font-semibold text-gray-500">{degree}</span>}
                    </h2>
                    <p className="text-gray-600">
                        {programmeNames.length > 1
                            ? `Available via ${programmeNames.length} programmes`
                            : programmeNames.length === 1 ? `Via ${programmeNames[0]}` : 'Direct entry'}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Notice */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                                <p>
                                    Veritas Pathways Entry Directories provide a guide to minimum entry requirements. Note that requirements and course availability are subject to change. Always refer to the official website for the most up-to-date information.
                                </p>
                                {/* Per-course pointers, from the university and course URLs in the import. */}
                                {universityUrl && (
                                    <p>
                                        Find out more about studying at{' '}
                                        <span className="capitalize">{course.university?.name || 'this university'}</span>{' '}
                                        from their{' '}
                                        <a href={universityUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                            International Students website
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>.
                                    </p>
                                )}
                                {courseUrl && (
                                    <p>
                                        Or find out more about{' '}
                                        <a href={courseUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                            {course.subject} on the course page
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Subject-specific requirements. This is the course's own guidance
                        and is the detail applicants most often need. */}
                    {notes && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <ClipboardList className="w-5 h-5 text-teal-600" />
                                <h3 className="font-bold text-gray-900">Subject requirements</h3>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {notes}
                            </p>
                        </div>
                    )}

                    {/* One section per programme that leads to this course, each
                        with its own EAP and academic requirements. */}
                    {programmes.map((programme) => (
                        <ProgrammeRequirements
                            key={programme._id || programme.programType || 'direct'}
                            programme={programme}
                            showHeading={programmes.length > 1 || Boolean(programme.programType)}
                            hasNotes={Boolean(notes)}
                        />
                    ))}
                </div>
            </div>

            {/* Hide scrollbar CSS */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default CourseDetailsModal;
