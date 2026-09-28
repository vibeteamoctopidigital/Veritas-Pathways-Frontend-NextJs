'use client';

import React, { useEffect, useState } from 'react';
import { Info, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { baseAPI } from '../../../../config/api';

// A course can be reached through several programmes (e.g. Accounting and
// Finance via the Foundation Year and via Year One). The database stores one
// row per programme; rows with the same university and course code are shown
// as one course on the website. This editor edits all of a course's rows at
// once: the shared details once, and each programme's requirements separately.

// Suggestions only: new programme names can be typed in.
const PROGRAMME_SUGGESTIONS = [
    'International Foundation Year',
    'Masters Preparation',
    'International Art & Design Foundation',
    'International Year One',
    'International Year One Business Management',
    'International Year One Accounting & Finance',
    'International Year One Computer Science',
    'International Year One Electrical & Electronic Engineering',
    'International Year One Events Management',
    'International Year One Law',
    'International Year Two Business Management',
    'International Year Two Events Management',
];
const EAP_GRADES = ['A*', 'A', 'B', 'C', 'D'];
const EAP_FIELDS = ['overall', 'listening', 'reading', 'speaking', 'writing'];
const MODULE_SLOTS = 4;

// Which requirement fields a programme uses, from its name. An unrecognised
// name shows every field.
const requirementGroupsFor = (programType = '') => {
    const name = programType.toLowerCase();
    if (name.includes('masters')) return ['research'];
    if (name.includes('art & design')) return ['modules'];
    if (/year (one|two)/.test(name)) return ['credits'];
    if (name.includes('foundation year')) return ['ify'];
    return ['ify', 'credits', 'research', 'modules'];
};

const emptyProgramme = (programType = 'International Foundation Year') => ({
    _id: null,
    programType,
    ifyPointsRequired: '',
    ifyGradesRequired: '',
    creditsRequired: '',
    averageScoreRequired: '',
    researchMethodsGrade: '',
    modules: Array(MODULE_SLOTS).fill(''),
    eap: { overall: '', listening: '', reading: '', speaking: '', writing: '' },
    notes: '',
});

const emptyDetails = {
    university: '',
    subject: '',
    degree: '',
    courseCode: '',
    version: '',
    courseUrl: '',
    universityUrl: '',
    isActive: true,
};

const toProgrammeForm = (row) => ({
    _id: row._id,
    programType: row.programType || '',
    ifyPointsRequired: row.ifyPointsRequired ?? '',
    ifyGradesRequired: row.ifyGradesRequired || '',
    creditsRequired: row.creditsRequired ?? '',
    averageScoreRequired: row.averageScoreRequired ?? '',
    researchMethodsGrade: row.researchMethodsGrade || '',
    modules: [...(row.modules || []), ...Array(MODULE_SLOTS).fill('')].slice(0, MODULE_SLOTS),
    eap: Object.fromEntries(EAP_FIELDS.map((field) => [field, row.eap?.[field] || ''])),
    notes: row.notes || '',
});

// Empty inputs are sent as null so clearing a field really clears it.
const orNull = (value) => (value === '' || value === undefined ? null : value);
const numberOrNull = (value) => (value === '' || value === null || value === undefined ? null : Number(value));

// Groups share a course code; a course typed in without one gets a generated
// code so that its programmes still group together.
const generateCourseCode = () => `VP${Date.now().toString(36).toUpperCase()}`;

const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#22B2A8] focus:border-transparent';

const Field = ({ label, hint, required, children, className = '' }) => (
    <label className={`block ${className}`}>
        <span className="block text-sm font-medium text-gray-700 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </span>
        {children}
        {hint && <span className="block mt-1 text-xs text-gray-500">{hint}</span>}
    </label>
);

const ProgrammeCard = ({ programme, index, canRemove, onChange, onRemove }) => {
    const groups = requirementGroupsFor(programme.programType);
    const set = (field) => (e) => onChange({ ...programme, [field]: e.target.value });
    const setEap = (field) => (e) => onChange({ ...programme, eap: { ...programme.eap, [field]: e.target.value } });
    const setModule = (slot) => (e) => {
        const modules = [...programme.modules];
        modules[slot] = e.target.value;
        onChange({ ...programme, modules });
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 space-y-4">
            <div className="flex items-start gap-3">
                <span className="mt-8 flex items-center justify-center w-6 h-6 rounded-full bg-[#22B2A8] text-white text-xs font-bold shrink-0">
                    {index + 1}
                </span>
                <Field label="Programme" required className="flex-1">
                    <input
                        list="course-programmes"
                        value={programme.programType}
                        onChange={set('programType')}
                        required
                        className={`${inputClass} bg-white`}
                        placeholder="e.g. International Foundation Year"
                    />
                </Field>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        title="Remove this programme"
                        aria-label={`Remove programme ${index + 1}`}
                        className="mt-7 p-2 rounded-md text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-9">
                {groups.includes('ify') && (
                    <>
                        <Field label="IFY points">
                            <input type="number" min="0" value={programme.ifyPointsRequired} onChange={set('ifyPointsRequired')} className={`${inputClass} bg-white`} placeholder="e.g. 120" />
                        </Field>
                        <Field label="IFY grades">
                            <input value={programme.ifyGradesRequired} onChange={set('ifyGradesRequired')} className={`${inputClass} bg-white`} placeholder="e.g. BBB" />
                        </Field>
                    </>
                )}
                {groups.includes('credits') && (
                    <>
                        <Field label="Credits required">
                            <input type="number" min="0" value={programme.creditsRequired} onChange={set('creditsRequired')} className={`${inputClass} bg-white`} placeholder="e.g. 120" />
                        </Field>
                        <Field label="Average score required">
                            <input type="number" min="0" max="100" value={programme.averageScoreRequired} onChange={set('averageScoreRequired')} className={`${inputClass} bg-white`} placeholder="e.g. 60" />
                        </Field>
                    </>
                )}
                {groups.includes('research') && (
                    <Field label="Research Methods grade">
                        <input value={programme.researchMethodsGrade} onChange={set('researchMethodsGrade')} className={`${inputClass} bg-white`} placeholder="e.g. Pass" />
                    </Field>
                )}
                {groups.includes('modules') && (
                    <div className="sm:col-span-2">
                        <span className="block text-sm font-medium text-gray-700 mb-1.5">Module results</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {programme.modules.map((value, slot) => (
                                <input
                                    key={slot}
                                    value={value}
                                    onChange={setModule(slot)}
                                    aria-label={`Module ${slot + 1}`}
                                    className={`${inputClass} bg-white`}
                                    placeholder={`Module ${slot + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="pl-9">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">EAP grades</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {EAP_FIELDS.map((field) => (
                        <label key={field} className="block">
                            <span className="block text-xs text-gray-500 mb-1 capitalize">{field}</span>
                            <select value={programme.eap[field]} onChange={setEap(field)} className={`${inputClass} bg-white`}>
                                <option value="">Not set</option>
                                {EAP_GRADES.map((grade) => (
                                    <option key={grade} value={grade}>{grade}</option>
                                ))}
                            </select>
                        </label>
                    ))}
                </div>
            </div>

            <div className="pl-9">
                <Field label="Notes" hint="Subject requirements shown on the course page.">
                    <textarea value={programme.notes} onChange={set('notes')} rows="2" className={`${inputClass} bg-white`} placeholder="e.g. IFY: Student must have strong Mathematics skills." />
                </Field>
            </div>
        </div>
    );
};

const detailsFrom = (course) => ({
    university: course.university?._id || course.university || '',
    subject: course.subject || '',
    degree: course.degree || '',
    courseCode: course.courseCode || '',
    version: course.version || '',
    courseUrl: course.courseUrl || '',
    universityUrl: course.universityUrl || '',
    isActive: course.isActive ?? true,
});

// Rendered only while open, and given a new key per course, so the form starts
// from the course it was opened for (all of its programme rows).
const EditModal = ({ onClose, course, onSave, mode = 'edit' }) => {
    const editing = mode === 'edit' && course;
    const [details, setDetails] = useState(() => (editing ? detailsFrom(course) : emptyDetails));
    const [programmes, setProgrammes] = useState(() =>
        editing ? (course.programmes?.length ? course.programmes : [course]).map(toProgrammeForm) : [emptyProgramme()],
    );
    const [removedIds, setRemovedIds] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        baseAPI.course
            .getUniversities({ limit: 1000 })
            .catch(() => null)
            .then((response) => {
                if (!cancelled) setUniversities(Array.isArray(response?.data?.data) ? response.data.data : []);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const setDetail = (field) => (e) =>
        setDetails((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const updateProgramme = (index, next) =>
        setProgrammes((prev) => prev.map((p, i) => (i === index ? next : p)));

    const removeProgramme = (index) => {
        const target = programmes[index];
        if (target._id) setRemovedIds((prev) => [...prev, target._id]);
        setProgrammes((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const courseCode = details.courseCode.trim() || generateCourseCode();
        const shared = {
            university: details.university,
            subject: details.subject.trim(),
            degree: orNull(details.degree.trim()),
            courseCode,
            version: orNull(details.version.trim()),
            courseUrl: orNull(details.courseUrl.trim()),
            universityUrl: orNull(details.universityUrl.trim()),
            isActive: details.isActive,
        };

        const rowPayload = (p) => ({
            ...shared,
            programType: p.programType.trim(),
            ifyPointsRequired: numberOrNull(p.ifyPointsRequired),
            ifyGradesRequired: orNull(p.ifyGradesRequired.trim()),
            creditsRequired: numberOrNull(p.creditsRequired),
            averageScoreRequired: numberOrNull(p.averageScoreRequired),
            researchMethodsGrade: orNull(p.researchMethodsGrade.trim()),
            modules: p.modules.map((m) => m.trim()).filter(Boolean),
            eap: Object.fromEntries(EAP_FIELDS.map((field) => [field, orNull(p.eap[field])])),
            notes: p.notes.trim(),
        });

        // Every request resolves with { success }, so check each one.
        const results = await Promise.all([
            ...programmes.map((p) =>
                (p._id ? baseAPI.course.updateCourse(p._id, rowPayload(p)) : baseAPI.course.createCourse(rowPayload(p)))
                    .catch(() => null),
            ),
            ...removedIds.map((id) => baseAPI.course.deleteCourse(id).catch(() => null)),
        ]);
        setSaving(false);

        const failed = results.filter((r) => !r?.success);
        if (failed.length === 0) {
            toast.success(mode === 'edit' ? 'Course updated' : 'Course created');
            onSave();
            onClose();
            return;
        }
        toast.error(failed[0]?.message || 'Some changes could not be saved. Please try again.');
        // Reload so the list reflects whatever did save.
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl w-full max-w-3xl shadow-xl max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{mode === 'edit' ? 'Edit course' : 'Add course'}</h2>
                    <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto thin-scrollbar">
                    <div className="p-6 space-y-8">
                        {/* Shared details */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Course details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="University" required>
                                    <select value={details.university} onChange={setDetail('university')} required className={`${inputClass} capitalize`}>
                                        <option value="">Select a university</option>
                                        {universities.map((u) => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Subject" required>
                                    <input value={details.subject} onChange={setDetail('subject')} required className={inputClass} placeholder="e.g. Accounting and Finance" />
                                </Field>
                                <Field label="Degree">
                                    <input value={details.degree} onChange={setDetail('degree')} className={inputClass} placeholder="e.g. BSc" />
                                </Field>
                                <Field label="Entry" hint="The entry year shown on the course, e.g. 2025/26.">
                                    <input value={details.version} onChange={setDetail('version')} className={inputClass} placeholder="e.g. 2025/26" />
                                </Field>
                                <Field label="Course page URL">
                                    <input type="url" value={details.courseUrl} onChange={setDetail('courseUrl')} className={inputClass} placeholder="https://" />
                                </Field>
                                <Field label="University international page URL">
                                    <input type="url" value={details.universityUrl} onChange={setDetail('universityUrl')} className={inputClass} placeholder="https://" />
                                </Field>
                                <Field label="Course code" hint={mode === 'edit' ? 'Links the programmes below into one course.' : 'Optional. Generated automatically if left blank.'}>
                                    <input value={details.courseCode} onChange={setDetail('courseCode')} className={inputClass} placeholder="e.g. CC00244" />
                                </Field>
                                <label className="flex items-center gap-2 self-end pb-2 cursor-pointer">
                                    <input type="checkbox" checked={details.isActive} onChange={setDetail('isActive')} className="w-4 h-4 accent-[#22B2A8]" />
                                    <span className="text-sm font-medium text-gray-700">Accepting applications</span>
                                </label>
                            </div>
                        </section>

                        {/* Programmes */}
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Programmes ({programmes.length})
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setProgrammes((prev) => [...prev, emptyProgramme('')])}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#22B2A8] text-[#158e88] text-sm font-medium hover:bg-[#22B2A8]/10"
                                >
                                    <Plus className="w-4 h-4" /> Add programme
                                </button>
                            </div>
                            <p className="flex gap-2 text-xs text-gray-500">
                                <Info className="w-4 h-4 shrink-0" />
                                Add one programme for each route into this course. The requirement fields change to
                                match the programme name.
                            </p>
                            <datalist id="course-programmes">
                                {PROGRAMME_SUGGESTIONS.map((name) => (
                                    <option key={name} value={name} />
                                ))}
                            </datalist>
                            {programmes.map((programme, index) => (
                                <ProgrammeCard
                                    key={programme._id || `new-${index}`}
                                    programme={programme}
                                    index={index}
                                    canRemove={programmes.length > 1}
                                    onChange={(next) => updateProgramme(index, next)}
                                    onRemove={() => removeProgramme(index)}
                                />
                            ))}
                        </section>
                    </div>

                    <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[#22B2A8] rounded-md hover:bg-[#1a9d8f] disabled:opacity-60">
                            {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
