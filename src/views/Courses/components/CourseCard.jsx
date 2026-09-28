import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { formatCountryName } from '../../../utils/formatName';
import UniversityAvatar from '../../../components/ui/UniversityAvatar';
import { primaryRequirement } from './courseRequirements';

const EAP_BANDS = ['listening', 'reading', 'speaking', 'writing'];

const CourseCard = ({ course, onViewDetails }) => {
    const country = course.university?.country?.name;
    // Most rows carry real guidance in `notes`; "N/A" is the import's placeholder.
    const notes = course.notes && course.notes.trim().toUpperCase() !== 'N/A' ? course.notes : null;
    const bandCount = EAP_BANDS.filter((band) => course.eap?.[band]).length;
    const requirement = primaryRequirement(course);
    const otherProgrammes = (course.programmes?.length || 1) - 1;

    return (
        <article className="group bg-white border border-gray-200 rounded-xl p-5 flex flex-col hover:border-[#1BA39C] hover:shadow-md transition-all duration-200">
            {/* Meta row */}
            <div className="flex items-center justify-between gap-3 mb-4">
                {course.programType ? (
                    <span className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#1BA39C]/10 text-[#1BA39C] text-xs font-semibold tracking-wide">
                            {course.programType}
                        </span>
                        {otherProgrammes > 0 && (
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                                +{otherProgrammes} more
                            </span>
                        )}
                    </span>
                ) : (
                    <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
                        Direct entry
                    </span>
                )}
                {country && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {formatCountryName(country)}
                    </span>
                )}
            </div>

            {/* Subject is what people scan for, so it leads. */}
            <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {course.subject}
                {course.degree && (
                    <span className="ml-1.5 text-sm font-semibold text-gray-500">{course.degree}</span>
                )}
            </h3>

            {/* University */}
            <div className="mt-3 flex items-center gap-3">
                <UniversityAvatar university={course.university} />
                <span className="text-sm font-medium text-gray-700 capitalize leading-snug">
                    {course.university?.name || 'University to be confirmed'}
                </span>
            </div>

            {notes && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-2" title={notes}>
                    {notes}
                </p>
            )}

            {/* Requirements */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
                    <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                        {requirement.label}
                    </span>
                    <span className="mt-1 flex items-baseline gap-1.5">
                        <span className={`font-bold text-gray-900 ${String(requirement.value).length > 6 ? 'text-base' : 'text-2xl'}`}>
                            {requirement.value}
                        </span>
                        {requirement.detail && (
                            <span className="text-sm font-semibold text-[#1BA39C]">
                                {requirement.detail}
                            </span>
                        )}
                    </span>
                </div>

                <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
                    <span className="block text-[11px] uppercase tracking-wide text-gray-500">
                        EAP Overall
                    </span>
                    {/* Individual bands live in the details modal; showing all four
                        here made the tile unreadable at card width. */}
                    <span className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#1BA39C] text-white font-bold ${course.eap?.overall ? 'text-sm' : 'text-[10px]'}`}>
                            {course.eap?.overall ?? 'N/A'}
                        </span>
                        {bandCount > 0 && (
                            <span className="text-[11px] text-gray-500 leading-tight">
                                {bandCount} band{bandCount === 1 ? '' : 's'} set
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* mt-auto keeps the button aligned across cards of differing height. */}
            <div className="mt-auto pt-5">
                <button
                    onClick={() => onViewDetails(course)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1BA39C] text-white text-sm font-semibold hover:bg-[#169488] transition-colors"
                >
                    Course details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </article>
    );
};

export default CourseCard;
